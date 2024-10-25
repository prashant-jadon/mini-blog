document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/blogs')
        .then(response => response.json())
        .then(blogs => {
            const blogList = document.getElementById('blog-list');
            blogs.forEach(blog => {
                const blogItem = document.createElement('div');
                blogItem.classList.add('blog-item'); // Add class for styling

                // Construct the HTML for each blog item, including username
                blogItem.innerHTML = `
                    <h2 class="blog-title"><a href="/blog.html?id=${blog.id}">${blog.title}</a></h2>
                    <p class="blog-username">Posted by: ${blog.username}</p>
                    <p class="blog-date">${new Date(blog.created_at).toLocaleString()}</p>
                `;
                blogList.appendChild(blogItem);
            });
        })
        .catch(error => console.error('Error fetching blogs:', error));
});
