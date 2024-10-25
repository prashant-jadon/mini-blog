document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const blogId = urlParams.get('id');
    
    fetch(`/api/blogs/${blogId}`)
        .then(response => response.json())
        .then(blog => {
            document.getElementById('blog-title').innerText = blog.title;
            document.getElementById('blog-content').innerText = blog.content;
        });
});

