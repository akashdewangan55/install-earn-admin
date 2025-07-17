const API_URL = "https://install-earn-app.onrender.com/api";
const adminUser = "admin";
const adminPass = "1234";

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    if (username === adminUser && password === adminPass) {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('admin-dashboard').style.display = 'block';
        loadApps();
    } else {
        alert("Invalid credentials!");
    }
}

function logout() {
    if (confirm("Are you sure you want to logout?")) {
        document.getElementById('admin-dashboard').style.display = 'none';
        document.getElementById('login-screen').style.display = 'block';
    }
}

function loadApps() {
    fetch(API_URL + "/apps")
    .then(res => {
        if (!res.ok) throw new Error('Failed to fetch apps');
        return res.json();
    })
    .then(data => {
        const appsList = document.getElementById('appsList');
        appsList.innerHTML = '';
        data.forEach(app => {
            const div = document.createElement('div');
            div.className = 'app-card';
            div.innerHTML = `<strong>${app.name}</strong><br>${app.description}<br>Bonus: ₹${app.bonus}
                <br><button class="edit" onclick="editApp('${app._id}')">Edit</button>
                <button onclick="deleteApp('${app._id}')">Delete</button>`;
            appsList.appendChild(div);
        });
    })
    .catch(err => alert('Error loading apps: ' + err.message));
}

function addApp() {
    const app = {
        name: document.getElementById('appName').value,
        description: document.getElementById('appDesc').value,
        bonus: document.getElementById('appBonus').value,
        icon: document.getElementById('appIcon').value,
        link: document.getElementById('appLink').value
    };
    fetch(API_URL + "/apps", {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(app)
    })
    .then(res => {
        if (!res.ok) return res.text().then(txt => { throw new Error('Backend error: ' + txt); });
        return res.json();
    })
    .then(() => {
        alert('App added successfully!');
        loadApps();
    })
    .catch(err => alert('Error adding app: ' + err.message));
}

function deleteApp(id) {
    if (!confirm('Are you sure you want to delete this app?')) return;
    fetch(API_URL + '/apps/' + id, {method: 'DELETE'})
    .then(res => {
        if (!res.ok) throw new Error('Failed to delete app');
        return res.json();
    })
    .then(() => {
        alert('App deleted!');
        loadApps();
    })
    .catch(err => alert('Error deleting app: ' + err.message));
}

function editApp(id) {
    const newName = prompt("Enter new name:");
    const newDesc = prompt("Enter new description:");
    const newBonus = prompt("Enter new bonus:");
    if (newName && newDesc && newBonus) {
        fetch(API_URL + '/apps/' + id, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({name: newName, description: newDesc, bonus: newBonus})
        })
        .then(res => {
            if (!res.ok) throw new Error('Failed to update app');
            return res.json();
        })
        .then(() => {
            alert('App updated!');
            loadApps();
        })
        .catch(err => alert('Error updating app: ' + err.message));
    }
}
