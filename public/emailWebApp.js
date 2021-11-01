//email list
//read and unread
//emaildescripton
//same as outlook
//drag
//inifite Scoll - implement
class Cache {
    constructor() {
        this.emails = [];
        if(!localStorage.getItem("emailItems")) {
            localStorage.setItem("emailItems", JSON.stringify(this.emails));
        }
    }

    getCacheData() {
        return JSON.parse(localStorage.getItem("emailItems"));
    }

    setCacheData(data) {
        return localStorage.setItem("emailItems", JSON.stringify(data));
    }
}

class API {
    constructor(page) {
        this.page = page || 1;
    }

    createEmailObj(index) {
        const page = index || this.page;
        const startIndex = (page - 1) * 15;
        const emails = [];
        const names = ['John','Alice','Einstein','Mark','Joe']
        for(let i = 0;i<Math.min((45-startIndex), 15);i++) {
            const count = Math.floor((Math.random() * 50) + 1);
            emails.push({
                id:`${startIndex+i}`,
                to: `xyz${i+1}@xyz.com`,
                name: `${names[Math.floor(Math.random() * (names.length-1))]}${startIndex+i}`,
                from: `abc${i+1}@abc.com`,
                cc: [`${count}abc@abc.com`,`${count+i}abc@abc.com`],
                bcc: [],
                children: [],
                subject: `Email Web APP Launch Details ${i+1}`,
                body: `${i+1} Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`
            })
        }
        return {
            emails: emails,
            hasMore: true
        }
    }

    fetchEmails(page,callback) {
        const data = this.createEmailObj(page);
        callback(data);
    }
}

class Email {
    constructor(options,cache,api) {
        this.main = document.getElementById(options.id);
        this.cache = cache;
        this.api = api;
        this.currentEmailLoggedIn = options.emailid;
        this.apiEmailData = [];
        this.init();
    }

    displayEmailList(inbox) {
        let cardView ="";
        inbox.forEach((list) => {
            cardView += `<div class="card" id=${list.id}>
                <div class="inline" data-action="select">
                    <h3>${list.name}</h3>
                    <span class="actionicons">
                        <i data-action="delete" class="fa fa-trash-o"></i>
                        <i class="fa fa-flag-o"></i>
                    </span>
                </div>
                <span class="subject" data-action="select">${list.subject}</span>
                <p class="body" data-action="select">${list.body}</p>
            </div>`;
        })
        this.emailListContainer.innerHTML = cardView;
    }

    displayEmailBody(email) {
        let view = "";
        view = `<div class="body-container">
            <div class="header">
                <div>
                    <h2>${email.subject}</h2>
                    <div class="details">
                        <span>${email.name}</span>
                        <span>&lt;${email.from}&gt;</span>
                    </div>
                    <div>
                        <span>To: ${email.to}</span>
                        <span>Cc: ${email.cc}</span>
                    </div>
                </div>
            </div>
            <div class="body-content">
                <p>${email.body}</p>
            </div>
        </div>`;
        this.bodyContainer.innerHTML = view;
    }

    renderEmails(data) {
        this.renderEmailTags();
        this.displayEmailList(data.emails);
        //this.displayEmailBody(data);
    }

    renderInit() {

    }

    fetchExisitingEmails(data) {
        this.apiEmailData = data;
        this.cache.setCacheData({...data, currentEmailLoggedIn: this.currentEmailLoggedIn});
        console.log(this.apiEmailData)
        this.renderEmails(data);
    }

    onEmailSelection(event) {
        const selectedId = event.currentTarget.id;
        const getLocalStorageData = this.cache.getCacheData();
        const selectedEmail = getLocalStorageData.emails.find((list) => list.id === selectedId);
        this.selectedEmail = selectedEmail;
        this.displayEmailBody(selectedEmail);
        if(event.target.dataset.action === 'delete') {
            this.deleteEmail();
            this.displayEmailList(this.cache.getCacheData().emails);
        }
        // const getLocalStorageData = this.cache.getCacheData();
        // const selectedEmail = getLocalStorageData.emails.find((list) => list.id === selectedId);
        // console.log(selectedEmail)
        // this.selectedEmail = selectedEmail;
        // console.log(getLocalStorageData.emails)
        //event.target.parentElement.style.background = 'aliceblue';
    }

    deleteEmail() {
        let getLocalStorageData = this.cache.getCacheData();
        getLocalStorageData.emails = getLocalStorageData.emails.filter((list) => list.id !== this.selectedEmail.id)
        this.cache.setCacheData(getLocalStorageData);
    }
    emailActionHandler(event) {
        console.log(event.target.innerHTML);
        if(event.target.text === 'New Email') {
            this.newEmailContainer.style.display = 'block';
        } else if(event.target.text === 'Delete') {
            console.log(this.selectedEmail)
            this.deleteEmail();
            this.displayEmailList(this.cache.getCacheData().emails);
            // let getLocalStorageData = this.cache.getCacheData();
            // getLocalStorageData.emails = getLocalStorageData.emails.filter((list) => list.id !== this.selectedEmail.id)
            // this.cache.setCacheData(getLocalStorageData);
        }
    }

    selectEmailTag(event) {
        console.log(event.target.innerText)
        const selectedTag = event.target.textContent.split(" ")[0];
        console.log(selectedTag)
        const getLocalStorageData = this.cache.getCacheData();
        if(selectedTag === 'Inbox') {
            this.displayEmailList(getLocalStorageData.emails);
        } else if (selectedTag === 'Sent') {
            this.displayEmailList(getLocalStorageData.sent);
        } else if (selectedTag === 'Drafts') {
            this.displayEmailList(getLocalStorageData.emails);
        }
    }

    renderEmailTags() {
        const tags = ['Inbox','Drafts','Sent','Deleted Items']
        let view = "";
        const getLocalStorageData = this.cache.getCacheData();
        // view +=`<h2>${getLocalStorageData.currentEmailLoggedIn}</h2>`;
        tags.forEach((tag) => {
            if(tag === 'Inbox') {
                view +=`<li>${tag} <span>${getLocalStorageData.emails.length}</span></h2>`
            } else if(tag === 'Sent') {
                view +=`<li>${tag} <span>${getLocalStorageData.sent?.length || ''}</span></h2>`
            } else {
                view +=`<li>${tag}</h2>`
            }
        })
        this.emailDetails.innerHTML = `<h2>${getLocalStorageData.currentEmailLoggedIn}</h2>
        <ul>
            ${view}
        </ul>`;
        document.querySelector('.email_details ul').addEventListener('click', this.selectEmailTag.bind(this));
    }
    updateSentItems() {
        this.renderEmailTags();
    }

    async sendEmail(formObj) {
        console.log(formObj);
        const rawResponse = await fetch('/send', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formObj)
        })
        const result = await rawResponse.json();
        console.log(result);
    }

    sendEmailHandler(emailDetails) {
        let getLocalStorageData = this.cache.getCacheData();
        if(!getLocalStorageData.sent) {
            getLocalStorageData.sent = [].concat(emailDetails)
        } else {
            getLocalStorageData.sent.push(emailDetails);
        }
        //getLocalStorageData.sent = [].concat(emailDetails) || getLocalStorageData.sent.push(emailDetails)
        console.log(getLocalStorageData)
        this.cache.setCacheData(getLocalStorageData);
        this.updateSentItems();
    }
    serialize() {

    }

    hideModal() {
        this.modal.style.display = 'none';
    }
    showModal() {
        this.modal.style.display = 'block';
        this.modal.querySelector('.modal__container p').innerHTML = 'Please specify at least one recipient.'
        this.modal.querySelector('.close-btn').addEventListener('click', this.hideModal.bind(this))
    }

    submitEmailHandler(event) {
        event.preventDefault();
        let formValid = false;
        const values = {};
        const htmlbody = {};
        const form = event.target.elements;
        console.log(form)
        for(let i = 0;i<form.length-1;i++) {
            const fields = form[i].value;
            const fieldName = form[i].name;
            console.log(form[i].name)
            if((fieldName === 'to' && !fields)){
                this.showModal();
            } else if(fields && fieldName === 'to') {
                formValid = true;
                values[fieldName] = fields;
            } else if(fieldName === 'cc' || fieldName === 'bcc'){
                values[fieldName] =  fields ? [].concat(fields) : [];
            } else if(fieldName === 'body') {
                values[fieldName] = fields;
            } else {
                values[fieldName] = fields;
            }
        }
        if(formValid) {
            values.from = this.currentEmailLoggedIn;
            htmlbody["body"] = this.iframeContainer.body.innerHTML;
            console.log(htmlbody);
            this.sendEmail({...values, ...htmlbody});
            this.sendEmailHandler(values);
            this.hideNewMailModal();
        }
    }

    hideNewMailModal() {
        this.newEmailContainer.style.display = 'none';
    }

    formatText(event) {
        const formatType = event.currentTarget.dataset.formatType;
        if(formatType !== 'url') {
            this.iframeContainer.execCommand(formatType, false, null);
        } else {
            const url = this.newEmailContainer.querySelector('#txtFormatUrl').value;
            this.iframeContainer.execCommand('createLink', false, url);
        }
    }

    attachListener() {
        this.emailListContainer.querySelectorAll('.card').forEach((card) => {
            card.addEventListener('click', this.onEmailSelection.bind(this))
        });
        this.emailActions.addEventListener('click', this.emailActionHandler.bind(this));
        this.newEmailFrom.addEventListener('submit', this.submitEmailHandler.bind(this));
        this.newEmailContainer.querySelectorAll('.toolbar a').forEach((aEle) => {
            aEle.addEventListener('click', this.formatText.bind(this))
        });
    }
    getSelectors() {
        this.emailListContainer = this.main.querySelector('.email-list-container');
        this.bodyContainer = this.main.querySelector('.email-body-container');
        this.emailActions = this.main.querySelector('.email-actions');
        this.newEmailContainer = this.main.querySelector('.new-email-container');
        this.newEmailFrom = this.newEmailContainer.querySelector('#new-email-form');
        this.modal = document.querySelector('.modal-container');
        this.emailDetails = this.main.querySelector('.email_details');
        this.iframeContainer = this.newEmailContainer.querySelector('#rich-editor').contentWindow.document;
        this.newEmailContainer.querySelector('#rich-editor').contentDocument.body.setAttribute('contentEditable', true);
        //this.newEmailFrom.querySelector('#rich-editor').document.designMode = "on";
    }
    init() {
        this.getSelectors();
        const getLocalStorageData = this.cache.getCacheData();
        console.log(getLocalStorageData)
        if(getLocalStorageData && getLocalStorageData.emails?.length > 0) {
            this.renderEmails(getLocalStorageData);
        } else {
            this.api.fetchEmails(1,this.fetchExisitingEmails.bind(this));
        }
        this.attachListener();
       // this.sendEmail();
    }

}

const e1 = new Email({id: 'email-webapp', emailid: 'hello@hi.com'}, new Cache(),new API());
