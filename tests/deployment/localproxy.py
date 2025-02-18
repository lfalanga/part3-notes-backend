# from pypac import PACSession
# session = PACSession()
# session.get('http://example.org')

# from pypac import PACSession, get_pac
# # pac = get_pac(url='http://foo.corp.local/proxy.pac')
# pac = get_pac(url='http://127.0.0.1:9000/localproxy-9b964a38.pac')
# session = PACSession(pac)

# print(session.get('http://www.google.com').text)

"""
requests_connect_with_headers_using_pacfile.py
@brad_anton

Certain proxy servers require Full HTTP headers to be included in the
HTTP CONNECT request, however requests seems to split these up into
multiple packets. This work around combines the headers and connect into
a single send().

Documented in:
    https://github.com/requests/requests/issues/4884
    https://github.com/urllib3/urllib3/issues/1491

PyPAC offers the ability to do PAC file processing however it does
not properly handle evaluating the proxies for each request of a
redirect chain. The SessionPAC class below implements a slimmed down example of
as PyPAC's PACSession but with the goal of defining the proxies for each request
in a redirect chain.

Documented in:
    https://github.com/carsonyl/pypac/issues/37

Usage:
    Define TestProxies.PAC_FILE or uncomment the simple test and define pac_file

"""
import requests
from requests import Session
from requests.adapters import HTTPAdapter
from requests.packages.urllib3 import proxy_from_url
from requests.packages.urllib3.connection import VerifiedHTTPSConnection
from pypac import get_pac
from pypac.resolver import ProxyResolver

import logging
import unittest

try:
    import http.client as http_client
    # from http.HTTPStatus import OK
    from http import HTTPStatus
except ImportError:
    # Python 2
    import httplib as http_client
    from httplib import OK

class VerifiedHTTPSConnectionWithHeaders(VerifiedHTTPSConnection):
    def _tunnel(self):
        """This is just a simple rework of the CONNECT method to combine
        the headers with the CONNECT request as it causes problems for
        some proxies
        """
        connect_str = "CONNECT %s:%d HTTP/1.0\r\n" % (self._tunnel_host,
            self._tunnel_port)
        header_bytes = connect_str.encode("ascii")

        for header, value in self._tunnel_headers.items():
            header_str = "%s: %s\r\n" % (header, value)
            header_bytes += header_str.encode("latin-1")

        self.send(header_bytes + b'\r\n')

        response = self.response_class(self.sock, method=self._method)
        (version, code, message) = response._read_status()

        if code != HTTPStatus.OK:
            self.close()
            raise OSError("Tunnel connection failed: %d %s" % (code,
                                                               message.strip()))
        while True:
            line = response.fp.readline(http_client._MAXLINE + 1)
            if len(line) > http_client._MAXLINE:
                raise LineTooLong("header line")
            if not line:
                # for sites which EOF without sending a trailer
                break
            if line in (b'\r\n', b'\n', b''):
                break

            if self.debuglevel > 0:
                print('header:', line.decode())

class ProxyConnectWithHeadersHTTPSAdapter(HTTPAdapter):
    """Overriding HTTP Adapter so that we can use our own Connection, since
        we need to get at _tunnel()
    """
    def proxy_manager_for(self, proxy, **proxy_kwargs):
        manager = super(ProxyConnectWithHeadersHTTPSAdapter, self).proxy_manager_for(proxy, **proxy_kwargs)

        # Need to override the ConnectionCls with our Subclassed one to get at _tunnel()
        manager.pool_classes_by_scheme['https'].ConnectionCls = VerifiedHTTPSConnectionWithHeaders
        return manager

class SessionPAC(Session):
    """Subclassing Session so we can get at the request()
        and rebuild_proxies() methods
    """
    def __init__(self, pacurl, **kwargs):
        super(SessionPAC, self).__init__()
        pac = get_pac(pacurl)
        self._proxy_resolver = ProxyResolver(pac)

    def _get_pac_proxies(self, url):
        """Helper method to standardize how we handle
        requests
        """
        proxies = self._proxy_resolver.get_proxies(url)
        proxy_dict = {}

        #print('_get_pac_proxies.proxies: {}'.format(proxies))

        for proxy in proxies:
            """Processing order is important here for PAC Files that don't
                define their scheme.. The assumption being made here
                is that proxies ending in 443 will want to be https, while
                proxies ending in :80 will want to be http
            """
            if proxy == 'DIRECT':
                return {}
            elif proxy.startswith('https://') or proxy.endswith(':443'):
                proxy_dict['https'] = proxy
            elif proxy.startswith('http://') or proxy.endswith(':80'):
                proxy_dict['http'] = proxy

        # Fix for the HTTP CONNECT Issue in httpclient
        if 'https' in proxy_dict:
            self.mount('https://', ProxyConnectWithHeadersHTTPSAdapter())

        # print('proxy_dict: {}'.format(proxy_dict))
        return proxy_dict

    def request(self, method, url, proxies=None, **kwargs):
        """Extending request() so we can grab the proxy for the
        url being requested.

        You could probably do some work here to make this more resilliant to exceptions.
        """
        proxies = self._get_pac_proxies(url)
        #print('request.proxies: {}'.format(proxies))
        response = super(SessionPAC, self).request(method, url, proxies=proxies, **kwargs)
        return response

    def rebuild_proxies(self, prepared_request, proxies):
        """Extending rebuild_proxies() so we can define the appropriate
        proxy for each in the redirect chain.

        You could probably do some work here to make this more resilliant to exceptions.
        """
        new_proxies = super(SessionPAC, self).rebuild_proxies(prepared_request, proxies)
        #print('rebuild_proxies.new_proxies: {}'.format(new_proxies))
        return self._get_pac_proxies(prepared_request.url)

class TestProxies(unittest.TestCase):
    # PAC_URL = 'https://somedomain/pacfile.pac'
    PAC_URL = 'http://127.0.0.1:9000/localproxy-9b964a38.pac'

    def _get(self, url, verify=True):
        with SessionPAC(self.PAC_URL) as s:
            s.verify = verify
            response = s.get(url)
        return response

    def test_https_url(self):
        r = self._get('https://google.com', verify=False)
        self.assertEqual(r.status_code, 200)

    def test_http_url(self):
        # Just a random non-SSL URL
        r = self._get('http://www.httpvshttps.com/')
        self.assertEqual(r.status_code, 200)

    def test_multiple_http_to_https_redirects(self):
        # Just a random URL that will redirect from http to https and other stuff
        r = self._get('http://www.internetbadguys.com/')
        self.assertEqual(r.status_code, 200)

def get(url, pacfile, verify=True):
    """This is here in case you want to uncomment things below and
        issue requests rather then run the unittests
    """
    with SessionPAC(pacfile) as s:
        s.verify = verify
        response = s.get(url)

    return response

if __name__ == '__main__':
    # Debugging Output
    """
    http_client.HTTPConnection.debuglevel = 1
    logging.basicConfig()
    logging.getLogger().setLevel(logging.DEBUG)
    requests_log = logging.getLogger("requests.packages.urllib3")
    requests_log.setLevel(logging.DEBUG)
    requests_log.propagate = True
    """

    # Simple Test
    """
    pac_url = 'https://somedomain/pacfile.pac'
    r = get('https://www.google.com', pac_url, verify=False)
    print(r.status_code)
    """

    pac_url = 'http://127.0.0.1:9000/localproxy-9b964a38.pac'
    r = get('https://www.google.com', pac_url, verify=True)
    print(r.status_code)

    # Basic tests
    # unittest.main()

    # s = SessionPAC('http://127.0.0.1:9000/localproxy-9b964a38.pac')._get_pac_proxies('http://www.google.com')
    # print(s)
