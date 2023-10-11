const url = 'http://localhost:8080/api/admin'
const userInfoUrl = 'http://localhost:8080/api/user'
fillRolesInModals()
fillNavBar()
loadUsersTable()
editInDB()
deleteInDB()
addNewUser()

function fillRolesInModals() {
    let roleSelect = fetch(url + "/roles").then((response) => response.json())
    let result = ''
    roleSelect.then(roles => {
        for (let i in roles) {
            result += `<option name="role" value=${roles[i].id}>${roles[i].name.replace("ROLE_", "")}</option>`
        }
        document.getElementById('addUserRoles').innerHTML = result
        document.getElementById('editUserRoles').innerHTML = result
        document.getElementById('deleteUserRoles').innerHTML = result
    });
}

function fillNavBar() {
    let currentUser = fetch(userInfoUrl).then((response) => response.json())
    let roles = ''
    currentUser.then((user) => {
        user.roles.forEach((role) => {
            roles += " ";
            roles += role.name.replace("ROLE_", "")
        })
        document.getElementById("navbar-email").innerHTML = user.username;
        document.getElementById("navbar-roles").innerHTML = ' with roles: ' + roles;
    })
}

function loadUsersTable() {
    fetch(url + "/users")
        .then(response => response.json())
        .then(users => getAllUsers(users));
}

function getAllUsers(users) {
    let tableData = '';
    for (let user of users) {
        tableData +=
            `<tr>
            <td>${user.id}</td>
            <td>${user.firstName}</td>
            <td>${user.lastName}</td>
            <td>${user.age}</td>
            <td>${user.username}</td>
            <td id=${'role' + user.id}>${user.roles.map(role => role.name.replaceAll("ROLE_", "")).join(' ')}</td>
            <td>
                    <button class="btn btn-info" type="button" id="btnEditUser"
                    data-toggle="modal" data-target="#editUserModal"
                    onclick='editModal(${user.id})'>Edit</button>
            </td>
            <td>
                    <button class="btn btn-danger" type="button" id="btnDeleteUser"
                    data-toggle="modal" data-target="#deleteUserModal"
                    onclick="deleteModal(${user.id})">Delete</button>
            </td>
            </tr>`
    }
    document.getElementById('allUsersTable').innerHTML = tableData;
}

function closeModal() {
    document.querySelectorAll(".btn-secondary").forEach((btn) => btn.click());
}

function loadRoles(u, options) {
    for (let i = 0; i < options.length; i++) {
        let roleName = options[i].innerHTML;
        for (let j = 0; j < u.roles.length; j++) {
            if (u.roles[j].name === "ROLE_" + roleName) {
                options[i].selected = true;
                break;
            }
            options[i].selected = false;
        }
    }
}

function addNewUser() {
    let form = document.forms["addUserForm"];
    form.addEventListener('submit', el => {
        el.preventDefault();

        let options = document.getElementById('addUserRoles').options;
        let roles = []
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                roles.push({id: options[i].value, role: 'ROLE_' + options[i].innerHTML})
            }
        }
        fetch(url + "/users",
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                body: JSON.stringify({
                    firstName: form.firstName.value,
                    lastName: form.lastName.value,
                    age: form.age.value,
                    username: form.username.value,
                    password: form.password.value,
                    roles: roles
                })
            })
            .then(async response => {
                if (response.ok) {
                    form.reset();
                    loadUsersTable()
                }
                if (!response.ok) {
                    console.log(await response.text())
                }
            })
        document.getElementById("first-tab").click();
    })
}

function editModal(id) {
    let editForm = document.forms["editUserForm"];
    fillRolesInModals();
    fetch(url + '/users/' + id, {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8'
        }
    }).then(response => {
        response.json().then(u => {
            editForm.elements.id.value = u.id
            editForm.firstName.value = u.firstName
            editForm.lastName.value = u.lastName
            editForm.age.value = u.age
            editForm.username.value = u.username
            editForm.password.value = u.password
            loadRoles(u, editForm.roles.options)
        })
    })
}

function editInDB() {
    document.getElementById("editUserForm").addEventListener('submit', el => {
        el.preventDefault();
        const id = document.getElementById("editUserId").value;
        let editForm = document.forms["editUserForm"];
        let options = editForm.roles.options;
        let rolesToArray = [];
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                rolesToArray.push({id: options[i].value, role: 'ROLE_' + options[i].innerHTML});
            }
        }
        fetch(url + "/users",
            {
                method: "PATCH",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                body: JSON.stringify({
                    id: id,
                    firstName: editForm.firstName.value,
                    lastName: editForm.lastName.value,
                    age: editForm.age.value,
                    username: editForm.username.value,
                    password: editForm.password.value,
                    roles: rolesToArray
                })
            }).then((response) => {
            if (response.ok) {
                closeModal()
                loadUsersTable()
            }
        })
        document.getElementById("firstTab").click();
    })
}

function deleteModal(id) {
    fillRolesInModals();
    fetch(url + '/users/' + id, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8'
        }
    }).then(response => {
        response.json().then(user => {
            document.getElementById('deleteUserId').value = user.id;
            document.getElementById('deleteUserFirstName').value = user.firstName;
            document.getElementById('deleteUserLastName').value = user.lastName;
            document.getElementById('deleteUserAge').value = user.age;
            document.getElementById('deleteUserEmail').value = user.username;
            let options = document.forms["deleteUserForm"].roles.options;
            loadRoles(user, options);
        })
    })
}

function deleteInDB() {
    document.getElementById('deleteUserForm').addEventListener('submit', el => {
        el.preventDefault();
        const id = document.getElementById("deleteUserId").value;

        fetch(url + "/users/" + id,
            {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json"
                }
            }).then((response) => {
            if (response.ok) {
                closeModal()
                loadUsersTable()
            }
        });
        document.getElementById("firstTab").click();
    })
}
