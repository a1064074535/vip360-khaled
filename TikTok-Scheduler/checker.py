import sys
import subprocess
import importlib.util
import os
from colorama import init, Fore, Style

# Initialize colorama
init(autoreset=True)

REQUIRED_PACKAGES = [
    'selenium',
    'webdriver_manager',
    'google.auth',
    'google_auth_oauthlib',
    'googleapiclient',
    'apscheduler',
    'pandas',
    'colorama',
    'tqdm'
]

FILES_TO_CHECK = [
    'tiktok_scheduler.py',
    'posts_generator.py',
    'requirements.txt',
    'videos/',
    'credentials.json'
]

def check_python_version():
    print(f"{Fore.CYAN}Checking Python version...{Style.RESET_ALL}")
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 7):
        print(f"{Fore.RED}❌ Python 3.7+ is required. You have {sys.version}{Style.RESET_ALL}")
        return False
    print(f"{Fore.GREEN}✅ Python {version.major}.{version.minor} detected.{Style.RESET_ALL}")
    return True

def check_packages():
    print(f"\n{Fore.CYAN}Checking required packages...{Style.RESET_ALL}")
    missing = []
    for package in REQUIRED_PACKAGES:
        # Handle package name differences (e.g. google-auth -> google.auth)
        pkg_name = package
        if package == 'google-auth': pkg_name = 'google.auth'
        if package == 'google-auth-oauthlib': pkg_name = 'google_auth_oauthlib'
        if package == 'google-api-python-client': pkg_name = 'googleapiclient'
        
        spec = importlib.util.find_spec(pkg_name)
        if spec is None:
            # Try alternative names or assume missing
            missing.append(package)
            print(f"{Fore.YELLOW}⚠️  Missing: {package}{Style.RESET_ALL}")
        else:
            print(f"{Fore.GREEN}✅ Found: {package}{Style.RESET_ALL}")
    
    if missing:
        print(f"\n{Fore.RED}❌ Some packages are missing.{Style.RESET_ALL}")
        print(f"Run: {Fore.YELLOW}pip install -r requirements.txt{Style.RESET_ALL}")
        return False
    return True

def check_files():
    print(f"\n{Fore.CYAN}Checking project files...{Style.RESET_ALL}")
    all_exist = True
    for file_path in FILES_TO_CHECK:
        if os.path.exists(file_path):
            print(f"{Fore.GREEN}✅ Found: {file_path}{Style.RESET_ALL}")
        else:
            if file_path == 'credentials.json':
                print(f"{Fore.YELLOW}⚠️  Missing: {file_path} (Required for Google Drive){Style.RESET_ALL}")
            elif file_path.endswith('/'):
                 print(f"{Fore.YELLOW}⚠️  Missing directory: {file_path}{Style.RESET_ALL}")
                 os.makedirs(file_path, exist_ok=True)
                 print(f"{Fore.GREEN}   -> Created directory: {file_path}{Style.RESET_ALL}")
            else:
                print(f"{Fore.RED}❌ Missing: {file_path}{Style.RESET_ALL}")
                all_exist = False
    return all_exist

def main():
    print(f"{Fore.MAGENTA}========================================{Style.RESET_ALL}")
    print(f"{Fore.MAGENTA}   TikTok Automation System Checker     {Style.RESET_ALL}")
    print(f"{Fore.MAGENTA}========================================{Style.RESET_ALL}\n")

    python_ok = check_python_version()
    packages_ok = check_packages()
    files_ok = check_files()

    print(f"\n{Fore.MAGENTA}========================================{Style.RESET_ALL}")
    if python_ok and packages_ok and files_ok:
        print(f"{Fore.GREEN}✅ System is ready to go!{Style.RESET_ALL}")
        print(f"Run: {Fore.CYAN}python tiktok_scheduler.py{Style.RESET_ALL}")
    else:
        print(f"{Fore.RED}❌ Please fix the issues above before running.{Style.RESET_ALL}")

if __name__ == "__main__":
    main()
