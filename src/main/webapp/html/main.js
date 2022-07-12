
function GET(url) {
    let ur = new XMLHttpRequest();
    ur.open('GET', url, false);
    ur.send(null);
    return ur;
}

function POST(url, body) {
    let ur = new XMLHttpRequest();
    ur.open('POST', url, false);
    ur.setRequestHeader("Content-type", "application/json;charset=UTF-8");
    ur.send(body);
    return ur;
}


function loadValue(pageNumbers){
    if (isNaN(pageNumbers)){
        pageNumbers = 0;
    }
    let countId = document.getElementById("selected").value;
    let jso = JSON.parse(GET('/rest/players/?pageNumber='+ pageNumbers + "&pageSize=" + countId).responseText);
    let table = document.getElementById("mainTable");
    table.innerHTML = "";
    createCountPages(countId);
    for (let i = 0; i < jso.length; i++){
     let tr = document.createElement("tr");
     let th = document.createElement("th");
     th.appendChild(document.createTextNode(jso[i].id));
     tr.appendChild(th);
     let tdName = document.createElement("td");
     tdName.appendChild(document.createTextNode(jso[i].name));
     tr.appendChild(tdName);
     let tdTitle = document.createElement("td");
     tdTitle.appendChild(document.createTextNode(jso[i].title));
     tr.appendChild(tdTitle);
     let tdRace = document.createElement("td");
     tdRace.appendChild(document.createTextNode(jso[i].race));
     tr.appendChild(tdRace);
     let tdProfession = document.createElement("td");
     tdProfession.appendChild(document.createTextNode(jso[i].profession));
     tr.appendChild(tdProfession);
     let tdLevel = document.createElement("td");
     tdLevel.appendChild(document.createTextNode(jso[i].level));
     tr.appendChild(tdLevel);
     let tdBirthday = document.createElement("td");
     let date = new Date;
     date.setTime(jso[i].birthday);
     tdBirthday.appendChild(document.createTextNode(date.toDateString()));
     tr.appendChild(tdBirthday);
     let tdBanned = document.createElement("td");
     tdBanned.appendChild(document.createTextNode(jso[i].banned));
     tr.appendChild(tdBanned);
     let editButton = document.createElement("button");
     editButton.setAttribute("type", "button");
     editButton.appendChild(document.createTextNode("Edit"));
     editButton.addEventListener("click", function () {
         editId(jso[i].id, tr);
     });
     let tdEdit = document.createElement("td");
     tdEdit.appendChild(editButton);
     tr.appendChild(tdEdit);
     let deleteButton = document.createElement("button");
        deleteButton.setAttribute("type", "button");
        deleteButton.setAttribute("id", "deleteBut");
        deleteButton.appendChild(document.createTextNode("Delete"));
        deleteButton.addEventListener("click", function () {
            deleteId(jso[i].id);
            loadValue();
        });
     let tdDelete = document.createElement("td");
     tdDelete.appendChild(deleteButton);
     tr.appendChild(tdDelete);
     table.appendChild(tr);
 }
}

function createCountPages(countPersonInPage, currentPage){
    let allCount = GET("/rest/players/count").responseText;
    let pages = allCount/countPersonInPage;
    let bar = document.getElementById("pageBar");
    bar.innerHTML = "";
        for (let i = 0; i < pages; i++) {
            let li = document.createElement("button");
            let a = document.createElement("a");
            a.setAttribute("class", "page-ling");
            a.setAttribute("href", "#");
            a.setAttribute("onclick", "loadValue(" + (i) + ")");
            a.appendChild(document.createTextNode(i + 1));
            li.appendChild(a);
            bar.appendChild(li);
        }
}

function editId (id, el){

    if (document.body.contains(document.getElementById("updated" + id))) {
        document.getElementById("updated" + id).remove();
        return;
    }

    let tr = document.createElement("tr");
    tr.setAttribute("id", "updated" + id);
    let th = document.createElement("th");
    th.setAttribute("scope", "row");
    th.setAttribute(document.createTextNode(""));
    tr.appendChild(th);

    let tdName = document.createElement("td");
    let nameInp = document.createElement("input");
    nameInp.setAttribute("type", "text");
    nameInp.setAttribute("class", "form-control");
    nameInp.setAttribute("size" , "10");
    nameInp.setAttribute("id", "updateName" + id);
    nameInp.setAttribute("value", id.name);
    tdName.appendChild(nameInp);
    tr.appendChild(tdName);
    el.insertAdjacentElement("afterEnd", tr);
}

function deleteId (id){
    let ur = new XMLHttpRequest();
    ur.open('DELETE', ("/rest/players/" + id), false);
    ur.send(null);
}

function saveNewChar(){
    let body = {};
    body.name = document.getElementById("inputName").value;
    body.title = document.getElementById("titleName").value;
    body.race = document.getElementById("newRace").value;
    body.profession = document.getElementById("newProfession").value;
    body.level = document.getElementById("inputLevel").value;
    body.birthday = new Date(document.getElementById("inputDate").value).getTime();
    let ban = document.getElementById("selectedBanned").value;
    body.banned = ban !== "FALSE";

    let responce = POST("/rest/players/", JSON.stringify(body));
    if (responce.status === 200){
        document.getElementById("inputName").value = "";
        document.getElementById("titleName").value = "";
        document.getElementById("newRace").value = "HUMAN";
        document.getElementById("newProfession").value = "WARRIOR";
        document.getElementById("inputLevel").value = "";
        document.getElementById("inputDate").value = "";
        document.getElementById("selectedBanned").value = "TRUE";
    }

    loadValue();
}

