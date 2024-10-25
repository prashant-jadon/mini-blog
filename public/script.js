document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/blogs')
        .then(response => response.json())
        .then(blogs => {
            const blogList = document.getElementById('blog-list');
            blogs.forEach(blog => {
                const blogItem = document.createElement('div');
                blogItem.innerHTML = `<h2><a href="/blog.html?id=${blog.id}">${blog.title}</a></h2><p>${new Date(blog.created_at).toLocaleString()}</p>`;
                blogList.appendChild(blogItem);
            });
        });
});
