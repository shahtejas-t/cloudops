import subprocess
import json
import shlex
import csv
import os


# redirected to aws commands
def executeAwsCommands(commands, KEY_FILE):
    result = {"status": 200, "response": ""}
    print(commands)
    print("--\n")

    try:
    # login
        login, user = loginWithAccessKey(KEY_FILE)
        print("login - ", login)
        print("User - ", user)
        if login == False:
            result = {"status": 401, "response": "Unauthorized Access"}
            return result



    #execute Commands
        execute_command = commands + " --output json --profile " + user
        print("Excuting comand: ", execute_command)

        if "run-instances" in commands:
            execute_command = execute_command + " --instance-type t3.micro --image-id=ami-090793d48e56d862c"


        commands_output_josn = json.loads(subprocess.check_output(shlex.split(execute_command)))
        print(json.dumps(commands_output_josn, indent=4))
        # return commands_output_josn
        result['response'] = commands_output_josn



    except subprocess.CalledProcessError as e:
        print(f"Command failed with return code {e}")
        result['response'] = e.output
        result['status'] = 500
        # return result:
    

    except Exception as e:
        print("Error", e)
        result['response'] = {"error while executing gcloud command"}
        result['status'] = 500

    finally:
    # logout
        logout_aws()
        print("Logout")
        return result






# login with aws config file ..set profile and default region
def loginWithAccessKey(KEY_FILE):
    try:
        # profile = json.load(open(KEY_FILE))
        with open(KEY_FILE, 'r') as f:

            dict_reader = csv.DictReader(f)
            list_of_dict = list(dict_reader)
            # print(list_of_dict)
            username = [value['User Name'] for value in list_of_dict]
            USER = str(username[0])
            print(USER)

            aws_login_command = "aws configure import --csv file://{}".format(
                KEY_FILE)
            aws_login = subprocess.check_output(shlex.split(aws_login_command))
            print(aws_login)

            default_region_command = "aws configure set region eu-north-1 --profile {}".format(USER)
            set_default_region = subprocess.check_output(shlex.split(default_region_command))

            get_default_region = "aws configure get region  --profile {}".format(USER)
            aws_default_region = subprocess.check_output(shlex.split(get_default_region))
            print(aws_default_region)


        return True, USER
    except subprocess.CalledProcessError as e:
        print(f"Command failed with return code {e.output}")
        return {"status": 500, "error": "Not able to login"}



# logout
def logout_aws():
    try:
        home_directory = os.path.expanduser('~/.aws/credentials')
        rm_profile = ['rm', home_directory]
        remove_profile = subprocess.check_output(rm_profile)
        print(remove_profile)

        # cat_file = ['cat',home_directory]
        # print_profile = subprocess.check_output(cat_file)
        # print(print_profile)
        config = os.path.expanduser('~/.aws/config')
        rm_config = ['rm', config]
        remove_config = subprocess.check_output(rm_config)
        print(remove_config)

    except subprocess.CalledProcessError as e:
        print(e.returncode)
        print(e.output)



    

    # list all running and terminated instances
# executeAwsCommands("aws ec2 describe-instances", KEY_FILE)
    
    # Only list running instances
# executeAwsCommands('aws ec2 describe-instances --filters "Name=instance-state-name,Values=running" --output text', KEY_FILE)


# executeAwsCommands("aws ec2 run-instances --instance-type t3.micro --image-id=ami-090793d48e56d862c --tag-specifications", KEY_FILE)
# executeAwsCommands("aws ec2 run-instances", KEY_FILE)




# executeAwsCommands("aws ec2 terminate-instances --instance-ids i-0876b6cb2e5977620", KEY_FILE)
# executeAwsCommands("aws ec2 terminate-instances --instance-ids i-0a1c4235ec47f2369", KEY_FILE)


