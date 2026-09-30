<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<html>
<head>
    <title>Edit User</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
</head>
<body class="container mt-4">

<h2>Edit User</h2>
<form action="${pageContext.request.contextPath}/user-update" method="post" class="mb-3">
    <input type="hidden" name="id" value="${user.id}">
    <div class="mb-3">
        <label class="form-label">Name</label>
        <input type="text" name="name" value="${user.name}" class="form-control" required>
    </div>
    <div class="mb-3">
        <label class="form-label">Email</label>
        <input type="email" name="email" value="${user.email}" class="form-control" required>
    </div>
    <button type="submit" class="btn btn-primary">Update</button>
    <a href="${pageContext.request.contextPath}/user-list" class="btn btn-secondary">Cancel</a>
</form>

</body>
</html>
