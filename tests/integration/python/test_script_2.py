import subprocess


def test_simple_integration():
    try:
        result = subprocess.run(
            ["ls", "-l"], capture_output=True, text=True, check=True
        )
        assert "total" in result.stdout
    except subprocess.CalledProcessError as e:
        print(f"Command failed with return code {e.returncode}")
        print(f"Stdout: {e.stdout}")
        print(f"Stderr: {e.stderr}")
        assert False
