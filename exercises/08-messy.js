// Exercise 8: Messy code that needs refactoring

var data = [];

function handleCreateUser(req, callback) {
  if (!req.body) {
    callback(new Error("No body"), null);
    return;
  }
  if (!req.body.name) {
    callback(new Error("No name"), null);
    return;
  }
  if (!req.body.email) {
    callback(new Error("No email"), null);
    return;
  }
  if (req.body.name.length < 2) {
    callback(new Error("Name too short"), null);
    return;
  }
  if (!req.body.email.includes("@")) {
    callback(new Error("Invalid email"), null);
    return;
  }
  var user = {
    id: data.length + 1,
    name: req.body.name,
    email: req.body.email,
    createdAt: new Date().toISOString(),
  };
  data.push(user);
  callback(null, user);
}

function handleUpdateUser(req, callback) {
  if (!req.body) {
    callback(new Error("No body"), null);
    return;
  }
  if (!req.params.id) {
    callback(new Error("No id"), null);
    return;
  }
  var found = null;
  for (var i = 0; i < data.length; i++) {
    if (data[i].id == req.params.id) {
      found = data[i];
      break;
    }
  }
  if (!found) {
    callback(new Error("User not found"), null);
    return;
  }
  if (req.body.name) {
    if (req.body.name.length < 2) {
      callback(new Error("Name too short"), null);
      return;
    }
    found.name = req.body.name;
  }
  if (req.body.email) {
    if (!req.body.email.includes("@")) {
      callback(new Error("Invalid email"), null);
      return;
    }
    found.email = req.body.email;
  }
  found.updatedAt = new Date().toISOString();
  callback(null, found);
}

function handleDeleteUser(req, callback) {
  if (!req.params.id) {
    callback(new Error("No id"), null);
    return;
  }
  var index = -1;
  for (var i = 0; i < data.length; i++) {
    if (data[i].id == req.params.id) {
      index = i;
      break;
    }
  }
  if (index === -1) {
    callback(new Error("User not found"), null);
    return;
  }
  var deleted = data.splice(index, 1)[0];
  callback(null, deleted);
}

function handleGetUser(req, callback) {
  if (!req.params.id) {
    callback(new Error("No id"), null);
    return;
  }
  var found = null;
  for (var i = 0; i < data.length; i++) {
    if (data[i].id == req.params.id) {
      found = data[i];
      break;
    }
  }
  if (!found) {
    callback(new Error("User not found"), null);
    return;
  }
  callback(null, found);
}

function handleListUsers(req, callback) {
  if (req.query && req.query.search) {
    var results = [];
    for (var i = 0; i < data.length; i++) {
      if (data[i].name.toLowerCase().indexOf(req.query.search.toLowerCase()) !== -1) {
        results.push(data[i]);
      }
    }
    callback(null, results);
  } else {
    callback(null, data);
  }
}

module.exports = { handleCreateUser, handleUpdateUser, handleDeleteUser, handleGetUser, handleListUsers };
