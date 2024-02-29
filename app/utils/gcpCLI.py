import subprocess
import json
import shlex


def listInstances(vmName, projectId):
    try:
        list = "gcloud compute instances list --filter=\"name=(\'{}\')\"".format(
            vmName)
        instance_list_command = list+" --format json --project " + projectId
        instance_output_josn = json.loads(
            subprocess.check_output(shlex.split(instance_list_command)))
        print("--\n")
        is_exist = len(instance_output_josn)
        print(is_exist)
        return is_exist
        # print(instance_output_josn)
    except subprocess.CalledProcessError as e:
        print(f"Command failed with return code {e.returncode}")
        return {"status": 500, "error": "Not able to list instances"}


def prepare_command(commands):
    print(commands)
# formating output in json format
    if "--format" not in commands:
        commands = commands + " --format json "

# adding default zone if not present
    if "--zone" not in commands:
        commands = commands + " --zone us-east1-c "

# adding project id from service account file if user not provided
    # if "--project" not in commands:
    #     commands = commands + " --project" + projectId

    print("Prepared command -- \n", commands)
    return commands


def executeGcpCommands(command, KEY_FILE):
    result = {"status": 200, "response": ""}
    # load a key_file
    data = json.load(open(KEY_FILE))
    projectId = str(data['project_id'])
    try:
        # login
        login = loginWithServiceAccount(KEY_FILE)
        if login == False:
            result = {"status": 401, "response": "Unauthorized Access"}
            return result

        # prepare command to exexcute
        commands = command +" --format json " + " --project " + projectId
        # commands = prepare_command(command, projectId)

        # execute commands
        if "instances delete" in commands:
            print("Delete Block--------", commands)
            vmName = splitCommand(commands)
            is_vm_exist = listInstances(vmName, projectId)
            if is_vm_exist != 0:
                commands = prepare_command(commands)
                execute_command = commands + " -q"
                print("Executing command -- \n", commands)
                
                commands_delete_josn = json.loads(
                    subprocess.check_output(shlex.split(execute_command)))
                print(commands_delete_josn)
                result['response'] = f"Virtual Machine {vmName} Deleted Successfully"
                # return result
            else:
                print("No Virtual Machine avaialble with {} name".format(vmName))
                allInstance = listallInstances(projectId)
                result['response'] = allInstance
                # return result

        elif "instances create" in commands:
            print("Excuting comand: ", commands)
            # execute_command = commands

            # if "instances create" in commands:
            vmName = splitCommand(commands)
            is_vm_exist = listInstances(vmName, projectId)
            if is_vm_exist != 0:
                print("Virtual Machine with Same Name already exist")
                result["response"] = f"Virtual Machine with {vmName} this name already exist..Please try with another virtual Machine name"
                result["status"] = 400
                return result
            else:
                pass
                commands = prepare_command(commands)
                execute_command = commands
                print("Executing command -- \n", commands)

                commands_output_josn = json.loads(
                    subprocess.check_output(shlex.split(execute_command)))
                result['response'] = commands_output_josn

        elif "instances start" in commands or "instances stop" in commands:
            print("Start or Stop Block--------", commands)
            vmName = splitCommand(commands)
            is_vm_exist = listInstances(vmName, projectId)
            if is_vm_exist != 0:
                commands = prepare_command(commands)
                execute_command = commands
                print("Executing command -- \n", commands)

                commands_start_josn = json.loads(
                    subprocess.check_output(shlex.split(execute_command)))
                print(commands_start_josn)
                if commands_start_josn:
                    result['response']=commands_start_josn
                else:
                    result['response'] = f"Virtual Machine {vmName} stop Successfully"
            else:
                print("No Virtual Machine avaialble with {} name".format(vmName))
                allInstance = listallInstances(projectId)
                result['response'] = allInstance

        else:
            print("Default block")
            execute_command = commands
            print("Executing command -- \n", commands)

            commands_execute_josn = json.loads(
                subprocess.check_output(shlex.split(execute_command)))
            # print(json.dumps(list(commands_execute_josn)))
            print("--",commands_execute_josn)
            result['response'] = commands_execute_josn

    except subprocess.CalledProcessError as e:
        print(f"Command failed with return code {e}")
        result['response'] = e.output
        result['status'] = 500
        # return result

    except Exception as e:
        print("Error", e)
        result['response'] = {"error while executing gcloud command"}
        result['status'] = 500
        # return result
    finally:
        logout(projectId)
        print(result)
        return result


def splitDeleteCommand(command):
    splitdata = command.split()
    checkIndex = splitdata.index('delete')
    value = splitdata[checkIndex+1]
    print(value)
    return value

def splitCommand(command):
    splitdata = command.split()
    if "start" in command:
        checkIndex = splitdata.index('start')
    elif "stop" in command:
        checkIndex = splitdata.index('stop')
    elif "delete" in command:
        checkIndex = splitdata.index('delete')
    elif "create" in command:
        checkIndex = splitdata.index('create')


    value = splitdata[checkIndex+1]
    print(value)
    return value


def splitCreateCommand(command):
    splitdata = command.split()
    checkIndex = splitdata.index('create')
    value = splitdata[checkIndex+1]
    print(value)
    return value

# # list all running instances


def listallInstances(projectId):
    try:
        instance_list_command = "gcloud compute instances list --format json --project " + projectId
        instance_output_josn = json.loads(
            subprocess.check_output(shlex.split(instance_list_command)))
        print("--\n")
        vms = []
        # print(instance_output_josn)
        for instance in instance_output_josn:
            print(instance['name'])
            vms.append(instance['name'])
        return vms
    except subprocess.CalledProcessError as e:
        print(f"Command failed with return code {e.returncode}")
        return {"status": 500, "error": "Not able to List Insances"}


def loginWithServiceAccount(KEY_FILE):
    try:
        # projectID = json.load(open(KEY_FILE))
        gcloud_login__command = "gcloud auth login --cred-file={} --format json".format(
            KEY_FILE)
        gcloud_login_josn = json.loads(
            subprocess.check_output(shlex.split(gcloud_login__command)))
        # print(gcloud_login_josn)
        return True
    except subprocess.CalledProcessError as e:
        print(f"Command failed with return code {e.output}")
        return {"status": 500, "error": "Not able to login"}


def logout(projectId):
    try:
        logout_command = "gcloud auth revoke --project "+projectId
        logout = json.loads(subprocess.check_output(
            shlex.split(logout_command)))
        print("---------------------Logout------------")
        print(logout)
        return "Logout Successfully"
    except Exception as e:
        # print(f"Command failed with return code {e.returncode}")
        print(
            "Service account tokens cannot be revoked, but they will expire automatically.")
        print("Logged out")
        return {"status": 500, "error": "Not able to logout"}
