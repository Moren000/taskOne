const url = 'https://rickandmortyapi.com/api/character/?page='
// создали функцию, которая берет данные из сервера и ставит их на страницу.
async function fetchToDo(url) {
    const response = await fetch(url);
    const data = await response.json();

    const article = document.querySelectorAll('article');
    article.forEach(element=>element.classList.remove('articleFlex'));

    for(let i = 0; i < data.results.length; i++) {
        const section = article[i].querySelectorAll('.section');
        article[i].classList.add('articleFlex');
        article[i].querySelector('img').src= data.results[i].image;
        section[0].querySelector('a').href = data.results[i].url;
        section[0].querySelector('h2').innerHTML = data.results[i].name;
        section[0].querySelector('.status__icon').classList.add(data.results[i].status == 'Alive'? 'status_alive' : 'status_dead');
        section[0].querySelector('.status__icon').classList.remove(data.results[i].status != 'Alive'? 'status_alive' : 'status_dead');
        section[0].querySelector('.status_text').innerHTML = data.results[i].status + '-' + data.results[i].species;
        section[1].querySelector('a').innerHTML = data.results[i].location.name;
        section[1].querySelector('a').href = data.results[i].location.url; 
        section[2].querySelector('.gender').innerHTML = data.results[i].gender; 
    } 
};

fetchToDo(url)
.catch(()=>console.error('EROR'))

let page_now_pagination = 1;
//ПАГИНАЦИЯ
function delegate (box, selector, eventName,handler ) {
    box.addEventListener(eventName, function (e) {
        let elem = e.target.closest(selector);

        if (elem !==null && box.contains(elem)) {
            handler.call(elem, e)
        }   
    })
}

let navigation = document.querySelector('.navigation')

delegate (navigation, 'a', 'click', function (e) {
    
    let arr_a = navigation.querySelectorAll('a');
    // в том случае если нам надо перейти на 1 или 42 страницу, остальные страницы подстроятся и получат подходящее число
    if (this.dataset.page == 'changeNumdefault') {
        let numA = Number(this.innerHTML);
        if (numA == 1) {
            for(let i = 1; i <= arr_a.length-2; i++) {
                arr_a[i].innerHTML = i + 1;
            }
        } else {
            for(let i = arr_a.length-2; i >= 1; i--) {
                arr_a[i].innerHTML = --numA;
            }
            page_now_pagination = Number(this.innerHTML);
        }
    }
    
    fetchToDo(url + this.innerHTML)
    .catch(()=>console.error('EROR'))
    
    changeClassA(this, arr_a)

    if (this.dataset.page == 'changeNum') {
        changeNumA(arr_a, e)
    } 
    
})


// функция динамического изменения номеров списка страниц
function changeNumA(arr, e) {
    let num;
    let numIH = Number(e.target.innerHTML);
    console.log(numIH);
    if (numIH > page_now_pagination && numIH != 41 && numIH != 2) {
        num = 2;
        changeClassA(arr[2], arr)
    } else if (numIH < page_now_pagination && numIH != 2 && numIH != 41) {
        num = -2;
        changeClassA(arr[3], arr)
    } else num = 0;
    page_now_pagination = numIH;
    for (let i = 1; i < arr.length-1; i++) {
        arr[i].innerHTML = Number(arr[i].innerHTML) + num;
    }
}



// функция подсвечивания текущей страницы
function changeClassA (elemA, arr) {
    arr.forEach(element => {
        element.classList.remove('page_now');
    });
    elemA.classList.add('page_now');
    pageNowNum = elemA.dataset.page;
}




//СОРТИРОВКА


let sort_btn = document.querySelector('.sort_Btn');

delegate(sort_btn, 'button', 'click', function(){

    let arrElements = Array.from(document.querySelectorAll('.characterCard'));
    let arrElementsSorted;

    if (this.classList.contains('alphabet_sort')) {
        arrElementsSorted = sortAlphabet(arrElements);

    } else if (this.classList.contains('default_sort')) {
        arrElementsSorted = sortDefault(arrElements);

    } else arrElementsSorted = sortGender(arrElements);
    let arr_td = document.querySelectorAll('td');
    
    for(let i = 0; i < arrElementsSorted.length; i++) {
        arr_td[i].append(arrElementsSorted[i])
    }
})

// функция сортировки по полу
function sortGender(arrElem) {
    return arrElem.sort((rowA)=> {
        let elementA = rowA.querySelector('.gender');
        return elementA.innerHTML == 'Female'  ? -1 : 1;
    })
}
// функция сортировки по умолчанию
function sortDefault (arrElem) {
    return arrElem.sort((rowA, rowB)=>Number(rowA.dataset.num) > Number(rowB.dataset.num) ? 1 : -1)
}

// функция сортировки по алфавиту 
function sortAlphabet (arrElem) {
    return arrElem.sort((rowA, rowB)=> {
        let elementA = rowA.querySelector('.name_character');
        let elementB = rowB.querySelector('.name_character');
        return elementA.innerHTML > elementB.innerHTML ? 1 : -1;
    }) 
    
}