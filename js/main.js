// rikiavimas?.. 😏
// localStorage

const h1DOM = document.querySelector('h1');
const formDOM = document.forms[0];
const textInputDOM = formDOM.querySelector('input');
const submitButtonDOM = formDOM.querySelector('button');
const listDOM = document.querySelector('.list');

const toastDOM = document.querySelector('.toast');
const toastTitleDOM = toastDOM.querySelector('.title');
const toastMessageDOM = toastDOM.querySelector('.message');
const toastCloseDOM = toastDOM.querySelector('.close');

toastCloseDOM.addEventListener('click', () => {
    toastDOM.classList.remove('active');
});

const localData = localStorage.getItem('tasks');
let todoData = [];

if (localData !== null) {
    todoData = JSON.parse(localData);
    renderList();
}

submitButtonDOM.addEventListener('click', e => {
    e.preventDefault();

    const validationMsg = isValidText(textInputDOM.value);
    if (validationMsg !== true) {
        showToastError(validationMsg);
        return;
    }

    todoData.push({
        text: textInputDOM.value.trim(),
        createdAt: Date.now(),
    });
    localStorage.setItem('tasks', JSON.stringify(todoData));
    renderList();
    showToastSuccess('Įrašas sėkmingas sukurtas.');
});

function renderList() {
    if (todoData.length === 0) {
        renderEmptyList();
    } else {
        renderTaskList();
    }
}

function renderEmptyList() {
    listDOM.classList.add('empty');
    listDOM.textContent = 'Empty';
}

function renderTaskList() {
    let HTML = '';

    for (const todo of todoData) {
        HTML += `
            <article class="item">
                <div class="date">${formatTime(todo.createdAt)}</div>
                <div class="text">${todo.text}</div>
                <form class="hidden">
                    <input type="text">
                    <button type="submit">Update</button>
                    <button type="button">Cancel</button>
                </form>
                <div class="actions">
                    <button>Done</button>
                    <div class="divider"></div>
                    <button>Edit</button>
                    <button>Delete</button>
                </div>
            </article>`;
    }

    listDOM.innerHTML = HTML;
    listDOM.classList.remove('empty');

    const articlesDOM = listDOM.querySelectorAll('article');

    for (let i = 0; i < articlesDOM.length; i++) {
        const articleDOM = articlesDOM[i];
        const articleEditFormDOM = articleDOM.querySelector('form');
        const updateInputDOM = articleEditFormDOM.querySelector('input');
        const buttonsDOM = articleDOM.querySelectorAll('button');

        const updateDOM = buttonsDOM[0];
        updateDOM.addEventListener('click', event => {
            event.preventDefault();

            const validationMsg = isValidText(updateInputDOM.value);
            if (validationMsg !== true) {
                showToastError(validationMsg);
                return;
            }

            todoData[i].text = updateInputDOM.value.trim();
            renderTaskList();
            showToastSuccess('Įrašo informacija sėkmingai atnaujinta.');
        });

        const cancelDOM = buttonsDOM[1];
        cancelDOM.addEventListener('click', () => {
            articleEditFormDOM.classList.add('hidden');
            showToastInfo('Įrašo informacijos redagavimas baigtas be jokių pakeitimų.');
        });

        const editDOM = buttonsDOM[3];
        editDOM.addEventListener('click', () => {
            articleEditFormDOM.classList.remove('hidden');
        });

        const deleteDOM = buttonsDOM[4];
        deleteDOM.addEventListener('click', () => {
            todoData.splice(i, 1);
            renderList();
            showToastSuccess('Įrašas sėkmingas ištrintas.');
        });
    }
}

function formatTime(timeInMs) {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
    // minimum 100-ieji metai ???
    // maximum ???
    const date = new Date(timeInMs);
    const y = date.getFullYear();
    const m = (date.getMonth() < 9 ? '0' : '') + (date.getMonth() + 1);
    const d = (date.getDate() < 10 ? '0' : '') + date.getDate();
    const h = date.getHours();
    const mn = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
    const s = (date.getSeconds() < 10 ? '0' : '') + date.getSeconds();

    return `${y}-${m}-${d} ${h}:${mn}:${s}`;
}

function isValidText(text) {
    if (typeof text !== 'string') {
        return 'Informacija turi būti tekstinė';
    }

    if (text === '') {
        return 'Parašytas tektas negali būti tuščias.';
    }

    if (text.trim() === '') {
        return 'Parašytas tektas negali būti vien iš tarpų.';
    }

    if (text[0].toUpperCase() !== text[0]) {
        return 'Tekstas negali prasidėti mažąja raide.';
    }

    return true;
}

function showToast(state, title, msg) {
    toastDOM.classList.add('active');
    toastDOM.dataset.state = state;
    toastTitleDOM.textContent = title;
    toastMessageDOM.textContent = msg;
}

function showToastSuccess(msg) {
    showToast('success', 'Pavyko', msg);
}

function showToastInfo(msg) {
    showToast('info', 'Informacija', msg);
}

function showToastWarning(msg) {
    showToast('warning', 'Įspėjimas', msg);
}

function showToastError(msg) {
    showToast('error', 'Klaida', msg);
}

// CRUD operations:
// -----------------------------------
// create   array.push({initial data})
// read     array.map()
// update   array[i] = {updated data}
// delete   array.splice(i, 1)