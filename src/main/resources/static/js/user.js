const userInfoUrl = 'http://localhost:8080/api/user'
getInfoAboutUser();
fillNavBar()

function getInfoAboutUser() {
    let currentUser = fetch(userInfoUrl).then((response) => response.json());
    let roles = '';
    let userTableData = '';
    currentUser.then((user) => {
        user.roles.forEach((role) => {
            roles += " ";
            roles += role.name.replace("ROLE_", "");
        })
        userTableData += `<tr>
            <td>${user.id}</td>
            <td>${user.firstName}</td>
            <td>${user.lastName}</td>
            <td>${user.age}</td>
            <td>${user.username}</td>
            <td>${roles}</td>
                   </tr>`;
        document.getElementById("allUsersTable").innerHTML = userTableData;
    })
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