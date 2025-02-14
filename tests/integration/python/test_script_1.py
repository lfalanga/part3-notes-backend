import subprocess

def test_node_integration():
    try:
        result = subprocess.run(['node', 'your_node_script.js'], capture_output=True, text=True, check=True)
        assert "success" in result.stdout  # Replace "success" with an expected output from your Node script
    except subprocess.CalledProcessError as e:
        print(f"Node script failed with return code {e.returncode}")
        print(f"Stdout: {e.stdout}")
        print(f"Stderr: {e.stderr}")
        assert False
