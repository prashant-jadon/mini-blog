document.getElementById('blog-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;

    fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content })
    }).then(() => {
        alert('Blog posted successfully!');
        document.getElementById('blog-form').reset();
    });
});
