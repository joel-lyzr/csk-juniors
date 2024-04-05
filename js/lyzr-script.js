var chatbotObj = {}
function onLoad() {
  const lyzr_chatbot = document.getElementById('lyzr_chatbot')
  const chatbot_id = lyzr_chatbot.getAttribute('class')
  console.log(chatbot_id)
  let url = `https://data.api.chatagent.lyzr.ai/chatbot_details/?chatbot_id=${chatbot_id}`

  fetch(url)
    .then((res) => res.json())
    .then((response) => {
      console.log(response)
      chatbotObj = response[0]
      Object.freeze(chatbotObj)
      const chatTitle = document.getElementById('chatbot_name')
      chatTitle.innerText = chatbotObj.name
      appendMessage('bot', chatbotObj.welcome_message)
    })
    .catch((err) => {
      const formDiv = document.getElementById('myForm')
      formDiv.classList.remove('h-[25rem]')
      formDiv.classList.add('h-[5rem]')
      console.log(formDiv.classList.toString())

      const header = document.getElementById('header')
      header.classList.remove('flex')
      header.classList.add('hidden')

      const body = document.getElementById('body')
      body.classList.remove('flex')
      body.classList.add('hidden')

      const footer = document.getElementById('footer')
      footer.classList.remove('flex')
      footer.classList.add('hidden')

      const chatbotNotFound = document.getElementById('chatbot_not_found')
      chatbotNotFound.classList.remove('hidden')
      chatbotNotFound.classList.add('flex')

      console.log('Error fetching chatbot details => ' + err.message)
    })
}

window.onload = setTimeout(onLoad, 1000)
window.firstLoad = onLoad

function toggleChat() {
  const formDiv = document.getElementById('myForm')
  if (formDiv.style.display === 'none') {
    const unreadBadge = document.getElementById('unread')
    unreadBadge.className = 'hidden'
    formDiv.style.display = 'flex'
  } else {
    formDiv.style.display = 'none'
  }
}

function resetchat() {
  const chatWindow = document.getElementById('chat-messages')
  chatWindow.innerHTML = ''
  appendMessage(
    'bot',
    chatbotObj.welcome_message
      ? chatbotObj.welcome_message
      : 'Hello, how are you?'
  )
}

function onSend(event) {
  const key = event.key
  const type = event.type
  let url = `https://convo.api.chatagent.lyzr.ai/conversation/${chatbotObj.user}/${chatbotObj.knowledge_id}/${chatbotObj.id}`
  if (key === 'Enter' || type === 'click') {
    const message = document.getElementById('editor').value
    appendMessage('user', message)
    document.getElementById('editor').value = ''
    appendLoader()
    fetch(url, {
      method: 'POST',
      body: JSON.stringify({ role: 'user', content: message }),
      redirect: 'follow',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        removeLoader()
        const formDiv = document.getElementById('myForm')
        if (formDiv.style.display === 'none') {
          const unreadBadge = document.getElementById('unread')
          unreadBadge.className =
            'absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-600'
        }
        appendMessage(
          'bot',
          data[0].messages[data[0].messages.length - 1].content
        )
      })
      .catch((error) => {
        removeLoader()
        appendMessage(
          'bot',
          "I'm facing an unknown error. Please try again later."
        )
        console.log('Error in fetch', error)
      })
  }
}

function appendMessage(role, msg) {
  const chatWindow = document.getElementById('chat-messages')
  const li = document.createElement('li')
  li.innerHTML = addMessage(role, new Date().toLocaleString(), msg)
  chatWindow.appendChild(li)
  scrollToBottom()
}

function appendLoader() {
  const chatWindow = document.getElementById('chat-messages')
  const li = document.createElement('li')
  li.innerHTML = addLoader()
  chatWindow.appendChild(li)
  scrollToBottom()
}

function scrollToBottom() {
  const chatBottom = document.getElementById('chat-bottom')
  chatBottom.scrollIntoView()
}

function removeLoader() {
  const chatWindow = document.getElementById('chat-messages')
  chatWindow.removeChild(chatWindow.lastElementChild)
}

function getAvatar(role) {
  let avatar = ``
  if (role === 'user') {
    avatar = `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8">
            <path fill-rule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clip-rule="evenodd" />
          </svg>
        `
  } else {
    if (chatbotObj.logo) {
      avatar = `<img src="${chatbotObj.logo}" class="w-8 h-8 border rounded-full"/>`
    } else {
      avatar = `
          <svg
            width="30"
            height="30"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              class="fill-slate-800"
              r="24"
              cx="24"
              cy="24"
            />
            <path
              d="M21.3844 37.8303L18.8003 36.3688C17.415 37.1537 17.9612 39.2986 19.5463 39.2986H20.6319C20.8916 39.2986 21.1513 39.2309 21.3778 39.1023C21.864 38.8249 21.864 38.1145 21.3778 37.8371L21.3844 37.8303Z"
              class="fill-white"
            />
            <path
              d="M19.0808 15.0684C19.7935 15.8397 20.9923 15.8397 21.7049 15.0684C22.3576 14.3647 22.3576 13.2618 21.7049 12.5581L18.6812 9.28998C18.3416 8.9246 17.8687 8.71484 17.3692 8.71484C15.7908 8.71484 14.9716 10.6297 16.0572 11.8003L19.0808 15.0684Z"
              class="fill-white"
            />
            <path
              d="M28.1456 19.5138C27.433 18.7425 26.2275 18.7425 25.5149 19.5138C24.8622 20.2175 24.8622 21.3204 25.5149 22.0241L31.9086 28.9325L27.5396 31.4089C26.3075 32.1059 26.3075 33.9125 27.5396 34.6094C28.0857 34.9206 28.7517 34.9206 29.2978 34.6094L37.7028 29.8459L28.139 19.5138H28.1456Z"
              class="fill-white"
            />
            <path
              d="M27.5389 35.8612L27.3191 35.7327L23.6161 33.6351L15.311 28.9326L23.6161 19.9672L26.087 17.2946L31.1686 11.8071C32.2542 10.6365 31.435 8.72168 29.8566 8.72168C29.3571 8.72168 28.8842 8.93143 28.5445 9.29681L23.6161 14.6219L21.1386 17.2946L9.52344 29.846L19.9198 35.7394L23.6228 37.837L25.7873 39.0684C26.0537 39.2241 26.36 39.2985 26.6664 39.2985C28.5246 39.2985 29.1706 36.7882 27.5455 35.868L27.5389 35.8612Z"
              class="fill-white"
            />
          </svg>
      `
    }
  }
  return avatar
}

function addMessage(role, date, msg) {
  return `
      <li>
        <div class='group flex my-4'>
            <div class='flex-shrink-0 flex justify-center items-center'>
              ${getAvatar(role)}
            </div>
            <div>
              <span class="flex items-start">
                <h4 class="text-sm font-bold text-slate-600">
                  ${role === 'user' ? 'You' : chatbotObj.name}
                </h4>
                <p class="text-xs font-regular text-gray-500 dark:text-slate-400 ml-2">
                  ${date}
                </p>
              </span>
              
              <wc-markdown class="prose mt-1 text-sm p-2 max-w-xl bg-slate-100 text-slate-800 rounded-lg">
                <script type="wc-content">
                  ${msg}
                </script>
              </wc-markdown>
            </div>
          </div>
      </li>`
}

function addLoader() {
  return `
      <div class="flex my-4">
        <div class="mr-1">
          ${getAvatar('bot')}
        </div>
        <div>
          <h4 class="text-sm font-bold text-slate-600">
            ${chatbotObj.name}
          </h4>
          <div class="mt-2 px-6 py-4 w-fit rounded-lg bg-slate-100">
            <div class="dot-typing" />
          </div>
        </div>
      </div>
      `
}
