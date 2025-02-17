//External OS PACFILE
function FindProxyForURL(url, host) {
        var privateIP = /^(0|10|100\.64|127|192\.168|172\.1[6789]|172\.2[0-9]|172\.3[01]|169\.254|192\.88\.99|161\.89|161\.90|156\.150|198\.148\.129|138\.69\.223)\.[0-9.]+$/;
    var resolved_ip = dnsResolve(host);
 
//ID1200  PROXY19 - [300+ users in APAC required to use this for supporting our customer Standard Charter ]
	if ( shExpMatch(host, "10.204.*") ) {
	if ( shExpMatch(host, "10.204.33.161") ) {  return "PROXY 161.89.192.10:3128"; }
	if ( shExpMatch(host, "10.204.33.163") ) {  return "PROXY 161.89.192.10:3128"; }
	if ( shExpMatch(host, "10.204.65.161") ) {  return "PROXY 161.89.194.10:3128"; }
	if ( shExpMatch(host, "10.204.33.162") ) {  return "PROXY 161.89.192.11:3128"; }
	if ( shExpMatch(host, "10.204.33.165") ) {  return "PROXY 161.89.192.11:3128"; }
	if ( shExpMatch(host, "10.204.65.162") ) {  return "PROXY 161.89.194.11:3128"; }
}
	 
//to VZEN : proxy-vzen.myatos.net
	if ( shExpMatch(host, "*.mev.atos.net")
	|| shExpMatch(host, "secureaccess.accorhotels.com")
	|| shExpMatch(host, "*.cscglobal.com")
	|| shExpMatch(host, "*.antai.gouv.fr")
	|| shExpMatch(host, "*.atosworldline.com")
	|| shExpMatch(host, "*.aw.atos.net")
	|| shExpMatch(host, "*.as8677.net")
	|| shExpMatch(host, "*.myworldline.com")
	|| shExpMatch(host, "ops.itsm.worldline.com")
	|| shExpMatch(host, "*.atosb2b.com")
	|| shExpMatch(host, "*.worldlineb2b.com")
	|| shExpMatch(host, "riskmanager2.uk.myatos.net")
	|| shExpMatch(host, "*.omnidox.co.uk")
	//|| shExpMatch(host, "myrisks.spapps-myatos.net")
	|| shExpMatch(host, "defra.service-now.com")
	|| shExpMatch(host, "nantes.fr")
	|| shExpMatch(host, "*.nantes.fr")
	|| shExpMatch(host, "nantesmetropole.fr")
	|| shExpMatch(host, "*.nantesmetropole.fr")
	//|| shExpMatch(host, "s1.ariba.com")
	|| shExpMatch(host, "gitlab.michelin.com")
	|| shExpMatch(host, "wac-das.corp.worldline.com")
	|| shExpMatch(host, "*.sips-services.com")
	|| shExpMatch(host, "safran.service-now.com")
	|| shExpMatch(host, "portail.agir.orange.com")
	|| shExpMatch(host, "supplychainterminaux.orange.com")
	|| shExpMatch(host, "89.168.120.44")
	|| shExpMatch(host, "79.76.112.123")
	|| shExpMatch(host, "138.2.128.227")
	|| shExpMatch(host, "rec.supplychainterminaux.orange.com")
	|| shExpMatch(host, "www.plus.transformation.gouv.fr")
	|| shExpMatch(host, "*.worldline-solutions.com")
	|| shExpMatch(host, "admin.france-identite.fr")
	|| shExpMatch(host, "*.forge.france-identite.fr")
	|| shExpMatch(host, "*.attijariwafa.com")
	|| shExpMatch(host, "jira.eurocontrol.int")
	|| shExpMatch(host, "bitbucket.eurocontrol.int")
	|| shExpMatch(host, "ror.esante.gouv.fr")
	|| shExpMatch(host, "rorcertification.esante.gouv.fr")
	|| shExpMatch(host, "rorformation.esante.gouv.fr")
	|| shExpMatch(host, "rortest.esante.gouv.fr")
	|| shExpMatch(host, "ctx-emea-sc-ext.littleover.net")
	|| shExpMatch(host, "*.admin.france-identite.fr")
	|| shExpMatch(host, "rordev.esante.gouv.fr")
	|| shExpMatch(host, "*.rordev.esante.gouv.fr")
	|| shExpMatch(host, "*.ror.esante.gouv.fr")
	|| shExpMatch(host, "*.rortest.esante.gouv.fr")
	|| shExpMatch(host, "*.rorformation.esante.gouv.fr")
	|| shExpMatch(host, "*.rorcertification.esante.gouv.fr")
	|| shExpMatch(host, "defragroup.service-now.com")
	|| shExpMatch(host, ".ositest.dataport.de")
	|| shExpMatch(host, ".dsecure-bdc.dataport.de")
	|| shExpMatch(host, ".ositest-bdc-net.dataport.de")
	|| shExpMatch(host, ".ositest-bdc-org.dataport.de")
	|| shExpMatch(host, ".ositest.dataport.de")
	|| shExpMatch(host, "c3662.eu.kennasecurity.com")
	|| shExpMatch(host, "andcoplatformtransportv3.quai13.fr")
	|| shExpMatch(host, "andcoplatformtransportviapost.quai13.fr")
	|| shExpMatch(host, "atosdart-uat.acsfna.com")
	|| shExpMatch(host, "atosdart.acsfna.com")
	|| shExpMatch(host, "*.uegar.com")
	|| shExpMatch(host, "*.ccomptes.fr")
	|| shExpMatch(host, "*.ppd.hcfp.fr")
	|| shExpMatch(host, "riskmanager3.uk.myatos.net")
	|| shExpMatch(host, "89.168.120.44")
	|| shExpMatch(host, "79.76.112.123")
	|| shExpMatch(host, "138.2.128.227")
	) { return "PROXY proxy-vzen.myatos.net:80"; }
 
            
    /* Don't send non-FQDN or private IP auths to us */
    if (isPlainHostName(host) || privateIP.test(resolved_ip))
        return "DIRECT";

    /* FTP goes directly */
    if (url.substring(0,4) == "ftp:")
        return "DIRECT";
	
	/* Bypass Zscaler */
	if (dnsDomainIs(host, "pilot-ura.it-solutions.atos.net") ||
    	dnsDomainIs(host, "emea2.it-solutions.myatos.net") ||
	    dnsDomainIs(host, "ura-us.it-solutions.atos.net") ||
        dnsDomainIs(host, "ura-aa.it-solutions.atos.net") ||
        dnsDomainIs(host, "ura-eu.it-solutions.atos.net") ||
        dnsDomainIs(host, "ura-fr.it-solutions.atos.net") ||
        dnsDomainIs(host, "ura-latam.it-solutions.atos.net") ||
        dnsDomainIs(host, "ura-us.it-solutions.atos.net") ||
        dnsDomainIs(host, "ura.it-solutions.atos.net") ||
        dnsDomainIs(host, "ura-ch.it-solutions.atos.net") ||
        dnsDomainIs(host, "access.fr.bds.myatos.net") ||
        dnsDomainIs(host, "urastg.it-solutions.atos.net") ||
        dnsDomainIs(host, "uratest-eu.it-solutions.atos.net") ||
        dnsDomainIs(host, "uratest-fr.it-solutions.atos.net") ||
        dnsDomainIs(host, "uksp.uk.atos.net") ||        
        dnsDomainIs(host, "ura-uk.it-solutions.atos.net") ||
        dnsDomainIs(host, "sslvpn-emea-ucc.global-intra.net") ||
        dnsDomainIs(host, "fr-diane-prod.cpz.myatos.net") ||
	    dnsDomainIs(host, "fr-iseran-prod.cpz.myatos.net") ||
	    dnsDomainIs(host, "sslvpn-emea-adn2-cvc.myatos.net") ||
	    dnsDomainIs(host, "fr.ura.eviden.com") ||
		dnsDomainIs(host, "fr-test.ura.eviden.com") ||
	    dnsDomainIs(host, "in.ura.eviden.com") ||
	    dnsDomainIs(host, "uk.ura.eviden.com") ||
	    dnsDomainIs(host, "us.ura.eviden.com") ||
	    dnsDomainIs(host, "ch.ura.eviden.com")
        ){
            return 'DIRECT';
    }


// RITM0232225 - ex-Paladion SSL VPN URLs

  if   ( shExpMatch(host, "1.23.240.210")
	   || shExpMatch(host, "23.24.121.145")
	   || shExpMatch(host, "49.248.111.50")
	   || shExpMatch(host, "111.93.146.246")
	   || shExpMatch(host, "113.193.224.6")
	   || shExpMatch(host, "114.143.216.139")
	   || shExpMatch(host, "115.160.255.18")
	   || shExpMatch(host, "115.160.255.20")
	   || shExpMatch(host, "151.253.109.210")
	   || shExpMatch(host, "182.73.231.66")
	   || shExpMatch(host, "182.73.231.67")
	   || shExpMatch(host, "182.76.11.242")
	   || shExpMatch(host, "vpn.crpn.fr")
	   ){ return "DIRECT"; }
	   
// IPEX cloud PBX Software

    if (shExpMatch(host, "atos.voipex.io")
     || shExpMatch(host, "*.wvd.microsoft.com")
        ){return "DIRECT";}

//  RITM1192704 bypass.saacon.net domain
// ZPA internal stuffs
    if (    shExpMatch(host, "*.saacon.net")
    || shExpMatch(host, "55.[14567].*")
    || shExpMatch(host, "55.16.191.*")
    || shExpMatch(host, "193.56.47.*")
    || shExpMatch(host, "*.frcl.bull.fr")
    || shExpMatch(host, "*.frec.bull.fr")
    || shExpMatch(host, "*.frld.bull.fr")
        ){return "DIRECT";}
           
	if (shExpMatch(host, "activation.sls.microsoft.com") ||
        shExpMatch(host, "officecdn.microsoft.com") ||
        shExpMatch(host, "*.msftconnecttest.com") ||
        shExpMatch(host, "*.msftncsi.com") ||
        shExpMatch(host, "*.msedge.net") ||
        shExpMatch(host, "*.c-msedge.net") ||
        shExpMatch(host, "msftncsi.com"))
        //return "PROXY 194.9.97.193:80; PROXY 165.225.20.44:80; DIRECT";
        return "PROXY 165.225.21.246:80; PROXY 165.225.204.40:80; DIRECT";
        
			
    /*
    **
    ** Default return to ZAPP Loopback
    ** 
    */ 
            	
    return "PROXY 127.0.0.1:9000";
}