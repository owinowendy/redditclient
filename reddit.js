document.getElementById('addSubredditBtn').addEventListener('click', () => {
    document.getElementById('popup').classList.remove('hidden');
  });
  
  document.getElementById('addSubreddit').addEventListener('click', () => {
    const subreddit = document.getElementById('subredditInput').value.trim();
    if (subreddit) {
      addSubredditLane(subreddit);
      document.getElementById('popup').classList.add('hidden');
      document.getElementById('subredditInput').value = '';
    }
  });
  
  async function fetchSubredditPosts(subreddit) {
    try {
      const response = await fetch(`https://www.reddit.com/r/${subreddit}.json`);
      if (!response.ok) throw new Error('Subreddit not found');
      const data = await response.json();
      return data.data.children.map(post => ({
        title: post.data.title,
        author: post.data.author,
        votes: post.data.ups,
        url: `https://reddit.com${post.data.permalink}`
      }));
    } catch (error) {
      alert(`Error fetching subreddit: ${error.message}`);
      return null;
    }
  }
  
  function addSubredditLane(subreddit) {
    fetchSubredditPosts(subreddit).then(posts => {
      if (!posts) return;
  
      const lane = document.createElement('div');
      lane.classList.add('lane');
      lane.innerHTML = `
        <h2>/r/${subreddit} <button class="lane-menu-btn">⋮</button></h2>
        <div class="lane-menu hidden">
          <button class="refresh-btn">Refresh</button>
          <button class="delete-btn">Delete</button>
        </div>
      `;
  
      posts.forEach(post => {
        const postDiv = document.createElement('div');
        postDiv.classList.add('post');
        postDiv.innerHTML = `
          <p><strong>${post.title}</strong></p>
          <p>↑ ${post.votes} | ${post.author}</p>
          <a href="${post.url}" target="_blank">Visit Post</a>
        `;
        lane.appendChild(postDiv);
      });
  
      const lanesContainer = document.getElementById('lanes-container');
      lanesContainer.appendChild(lane);
  
      // Event listeners for lane menu
      lane.querySelector('.lane-menu-btn').addEventListener('click', () => {
        lane.querySelector('.lane-menu').classList.toggle('hidden');
      });
      lane.querySelector('.refresh-btn').addEventListener('click', () => {
        refreshSubredditLane(subreddit, lane);
      });
      lane.querySelector('.delete-btn').addEventListener('click', () => {
        lanesContainer.removeChild(lane);
      });
    });
  }
  
  function refreshSubredditLane(subreddit, lane) {
    fetchSubredditPosts(subreddit).then(posts => {
      if (!posts) return;
      lane.querySelectorAll('.post').forEach(post => post.remove());
  
      posts.forEach(post => {
        const postDiv = document.createElement('div');
        postDiv.classList.add('post');
        postDiv.innerHTML = `
          <p><strong>${post.title}</strong></p>
          <p>↑ ${post.votes} | ${post.author}</p>
          <a href="${post.url}" target="_blank">Visit Post</a>
        `;
        lane.appendChild(postDiv);
      });
    });
  }
  