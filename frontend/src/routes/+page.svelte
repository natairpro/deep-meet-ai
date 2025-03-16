<script>
  // Placeholder data for demonstration
  let transcriptions = [
    { id: 1, timestamp: '10:30:15', speaker: 'Speaker 1', text: 'I think we should focus on improving the user experience first before adding new features.' },
    { id: 2, timestamp: '10:30:45', speaker: 'Speaker 2', text: 'I agree, but we also need to consider the timeline for the next release.' },
    { id: 3, timestamp: '10:31:20', speaker: 'Speaker 1', text: 'What if we prioritize the most critical UX issues and address them in the upcoming sprint?' },
    { id: 4, timestamp: '10:32:05', speaker: 'Speaker 3', text: 'That sounds reasonable. We could also gather more user feedback to identify those critical issues.' }
  ];
  
  let analyses = [
    { id: 1, type: 'Summary', content: 'The team is discussing how to balance UX improvements with feature development for the upcoming release.' },
    { id: 2, type: 'Key Points', content: 'Focus on UX improvements, consider release timeline, prioritize critical issues, gather user feedback.' },
    { id: 3, type: 'Action Items', content: 'Identify critical UX issues, plan for addressing them in the next sprint, collect additional user feedback.' },
    { id: 4, type: 'Sentiment', content: 'The conversation is collaborative and solution-oriented with a focus on practical next steps.' }
  ];
  
  // Theme toggle function
  function toggleTheme() {
    const html = document.querySelector('html');
    if (html) {
      const currentTheme = html.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      html.setAttribute('data-theme', newTheme);
    }
  }
</script>

<div class="min-h-screen flex flex-col">
  <!-- Header -->
  <header class="navbar bg-primary text-primary-content shadow-lg">
    <div class="flex-1">
      <a href="/" class="btn btn-ghost normal-case text-xl">DeepMeet AI</a>
    </div>
    <div class="flex-none gap-2">
      <button class="btn btn-square btn-ghost" on:click={toggleTheme} aria-label="Toggle theme">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
        </svg>
      </button>
      <div class="dropdown dropdown-end">
        <button tabindex="0" class="btn btn-ghost btn-circle avatar">
          <div class="w-10 rounded-full">
            <img src="https://ui-avatars.com/api/?name=User&background=random" alt="User avatar" />
          </div>
        </button>
        <ul class="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
          <li><a href="#settings">Settings</a></li>
          <li><a href="#logout">Logout</a></li>
        </ul>
      </div>
    </div>
  </header>

  <!-- Main content -->
  <main class="flex-grow p-4 md:p-6 bg-base-200">
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold">Meeting Dashboard</h1>
      <p class="text-base-content/70">Real-time transcription and AI-powered analysis</p>
    </div>
    
    <!-- Two-column layout -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Left column: Transcriptions -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title flex justify-between items-center">
            <span>Live Transcription</span>
            <button class="btn btn-sm btn-primary">Start Recording</button>
          </h2>
          <div class="divider"></div>
          <div class="space-y-4 max-h-[60vh] overflow-y-auto">
            {#each transcriptions as transcript}
              <div class="chat chat-start">
                <div class="chat-header">
                  {transcript.speaker}
                  <time class="text-xs opacity-50">{transcript.timestamp}</time>
                </div>
                <div class="chat-bubble">{transcript.text}</div>
              </div>
            {/each}
          </div>
        </div>
      </div>

      <!-- Right column: AI Analysis -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">AI Analysis</h2>
          <div class="divider"></div>
          <div class="space-y-4 max-h-[60vh] overflow-y-auto">
            {#each analyses as analysis}
              <div class="collapse collapse-arrow bg-base-200">
                <input type="radio" name="analysis-accordion" id="analysis-{analysis.id}" checked={analysis.id === 1} /> 
                <label for="analysis-{analysis.id}" class="collapse-title font-medium">
                  {analysis.type}
                </label>
                <div class="collapse-content"> 
                  <p>{analysis.content}</p>
                </div>
              </div>
            {/each}
          </div>
        </div>
      </div>
    </div>
  </main>

  <!-- Footer -->
  <footer class="footer footer-center p-4 bg-base-300 text-base-content">
    <div>
      <p>&copy; 2025 DeepMeet AI - Powered by Deepgram</p>
    </div>
  </footer>
</div>

<style>
  /* Add any custom styles here if needed */
</style>
