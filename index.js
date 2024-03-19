const BASE_URL = 'https://user-list.alphacamp.io/api/v1/users'
const users = []
let filterUsers = []
const USER_PER_PAGE = 12
const dataPanel = document.querySelector('#data-panel')
const paginator = document.querySelector('#paginator')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

dataPanel.addEventListener('click', function onPanelClick(event) {
  showUserModal(event.target.dataset.id)
})

paginator.addEventListener('click', function onPaginatorClick(event) {
  if (event.target.tagName !== "A") return
  const page = Number(event.target.dataset.page)
  renderUserList(getUserByPage(page))
})

searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()

  filterUsers = users.filter((user) =>
    user.name.toLowerCase().includes(keyword) || user.surname.toLowerCase().includes(keyword))
  if (filterUsers.length === 0) {
    return alert(`您輸入的名字：${keyword} 沒有符合使用者`)
  }

  renderPaginator(filterUsers.length)
  renderUserList(getUserByPage(1))
})

function getUserByPage(page) {
  const data = filterUsers.length ? filterUsers : users
  const startIndex = (page - 1) * USER_PER_PAGE
  return data.slice(startIndex, startIndex + USER_PER_PAGE)
}

function renderUserList(data) {
  let rawHTML = ''
  data.forEach((item) => {
    rawHTML += `
      <div class="col-sm-2">
        <div class="mb-2">
          <div class="card" data-bs-toggle="modal" data-bs-target="#user-modal" id="user-card">
            <img src="${item.avatar}" class="card-img-top"
              alt="User-Avatar" data-id="${item.id}">
            <div class="card-body">
              <p class="card-text text-center" data-id="${item.id}">${item.name} ${item.surname}</p>
            </div>
          </div>
        </div>
      </div>
      `
  })
  dataPanel.innerHTML = rawHTML
}

function renderPaginator(amount) {
  const numberOfPage = Math.ceil(amount / USER_PER_PAGE)
  let rawHTML = ''
  for (page = 1; page <= numberOfPage; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }
  paginator.innerHTML = rawHTML
}

function showUserModal(id) {
  const userEmail = document.querySelector('#user-email')
  const userGender = document.querySelector('#user-gender')
  const userAge = document.querySelector('#user-age')
  const userRegion = document.querySelector('#user-region')
  const userBirthday = document.querySelector('#user-birthday')
  const userAvatar = document.querySelector('#user-avatar')
  const userName = document.querySelector('#user-name')
  axios
    .get(BASE_URL + '/' + id).then((response) => {
      const data = response.data
      console.log(data)
      userName.innerText = data.name + " " + data.surname
      userEmail.innerText = "Email: " + data.email
      userGender.innerText = "Gender: " + data.gender
      userRegion.innerText = "Region: " + data.region
      userAge.innerText = "Age: " + data.age
      userBirthday.innerText = "Birthday: " + data.birthday
      userAvatar.innerHTML = `
              <img src="${data.avatar}" alt="User Avatar" class="img-fluid">`
    })
}

axios
  .get(BASE_URL)
  .then((response) => {
    users.push(...response.data.results)
    renderPaginator(users.length)
    renderUserList(getUserByPage(1))

  })
  .catch((err) => console.log(err))
