import subprocess
import json
import shlex


def listInstances(vmName, projectId):
    try:
        list = "gcloud compute instances list --filter=\"name=(\'{}\')\"".format(vmName)
        instance_list_command = list+" --format json --project "+ projectId
        instance_output_josn = json.loads(subprocess.check_output(shlex.split(instance_list_command)))
        print("--\n")
        is_exist = len(instance_output_josn)
        print(is_exist)
        return is_exist
        # print(instance_output_josn)
    except subprocess.CalledProcessError as e: 
        print(f"Command failed with return code {e.returncode}")

def executeCommands(commands, KEY_FILE):
    try:
        # load a key_file
        data = json.load(open(KEY_FILE))
        projectId=str(data['project_id'])

        # login
        loginWithServiceAccount(KEY_FILE)


        # execute commands
        if "instances delete" in commands:
            print("Delete Block--------", commands)
            vmName = splitCommand(commands)
            is_vm_exist=listInstances(vmName, projectId)
            if is_vm_exist!=0 :
                execute_command = commands +" --format json --zone us-east1-c -q --project "+ projectId 
                commands_delete_josn = json.loads(subprocess.check_output(shlex.split(execute_command)))
                print(commands_delete_josn)
                return commands_delete_josn
            else:
                print("No Virtual Machine avaialble with {} name".format(vmName))
                allInstance = listallInstances(projectId)
                return allInstance

        else:
            print("Excuting comand: ", commands)
            execute_command = commands +" --format json --project "+ projectId 

            if "instances create" in commands:
                execute_command = commands +" --format json --zone us-east1-c --project "+ projectId
            commands_output_josn = json.loads(subprocess.check_output(shlex.split(execute_command)))
            print(commands_output_josn)
            return commands_output_josn
    except subprocess.CalledProcessError as e: 
         print(f"Command failed with return code {e.returncode}")
    finally:
        logout(projectId)




def splitCommand(command):
    splitdata = command.split()
    checkIndex = splitdata.index('delete')
    value = splitdata[checkIndex+1]
    print (value)
    return value

# # list all running instances
def listallInstances(projectId):
    try:
        instance_list_command = "gcloud compute instances list --format json --project "+ projectId
        instance_output_josn = json.loads(subprocess.check_output(shlex.split(instance_list_command)))
        print("--\n")
        vms= []
        # print(instance_output_josn)
        for instance in instance_output_josn:
            print(instance['name'])
            vms.append(instance['name'])
        return vms
    except subprocess.CalledProcessError as e: 
        print(f"Command failed with return code {e.returncode}")


def loginWithServiceAccount(KEY_FILE):
    try:
        projectID = json.load(open(KEY_FILE))
        gcloud_login__command = "gcloud auth login --cred-file={} --format json".format(KEY_FILE)
        gcloud_login_josn = json.loads(subprocess.check_output(shlex.split(gcloud_login__command)))
        print(gcloud_login_josn)
    except subprocess.CalledProcessError as e: 
        print(f"Command failed with return code {e.returncode}")

def logout(projectId):
    try:
        logout_command = "gcloud auth revoke --project "+projectId
        logout= json.loads(subprocess.check_output(shlex.split(logout_command)))
        return "Logout Successfully"
    except:
        pass

