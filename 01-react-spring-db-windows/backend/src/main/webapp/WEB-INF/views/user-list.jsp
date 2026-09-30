<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<html>
<head>
    <title>User List</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
</head>
<body class="container mt-4">

<h2>User List</h2>

<table class="table table-striped table-hover">
    <thead class="table-dark">
        <tr>
            <th>ID</th><th>Name</th><th>Email</th><th>Action</th>
        </tr>
    </thead>
    <tbody>
    <c:forEach var="u" items="${users}">
        <tr>
            <td>${u.id}</td>
            <td>${u.name}</td>
            <td>${u.email}</td>
            <td>
                <a href="${pageContext.request.contextPath}/user-edit/${u.id}" class="btn btn-sm btn-warning">Edit</a>
                <a href="${pageContext.request.contextPath}/user-delete/${u.id}" class="btn btn-sm btn-danger"
                   onclick="return confirm('Delete this user?');">Delete</a>
            </td>
        </tr>
    </c:forEach>
    </tbody>
</table>

<h3>Add New User</h3>
<form action="${pageContext.request.contextPath}/user-add" method="post" class="row g-3">
    <div class="col-md-5">
        <input type="text" name="name" placeholder="Name" class="form-control" required>
    </div>
    <div class="col-md-5">
        <input type="email" name="email" placeholder="Email" class="form-control" required>
    </div>
    <div class="col-md-2">
        <button type="submit" class="btn btn-success w-100">Add</button>
    </div>
</form>

</body>
</html>
