<script>
  const projectData = {
    PolyKnight: {
      video: "https://www.youtube.com/embed/YOUR_VIDEO_ID_HERE",
      title: "PolyKnight",
      summary: "A soulslike combat project focused on modularity and polish.",
      details: [
        "Developed solo using UE5.",
        "Designed flexible combat system using components.",
        "Learned optimization techniques for modular mechanics.",
        "Planning evidence includes design doc and Trello board."
      ]
    },
    // Add more projects here...
  };

  function openModal(projectKey) {
    const data = projectData[projectKey];
    document.getElementById('modalVideo').src = data.video;
    document.getElementById('modalTitle').innerText = data.title;
    document.getElementById('modalSummary').innerText = data.summary;

    const list = document.getElementById('modalDetails');
    list.innerHTML = '';
    data.details.forEach(item => {
      const li = document.createElement('li');
      li.innerText = item;
      list.appendChild(li);
    });

    document.getElementById('projectModal').style.display = 'block';
  }

  function closeModal() {
    document.getElementById('projectModal').style.display = 'none';
    document.getElementById('modalVideo').src = '';
  }
</script>
