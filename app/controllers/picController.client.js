var userId;

$(document).ready(function() {
    getProfileAndPics();
    
    $('img').error(function(){
            $(this).attr('src', 'public/img/Image_PlaceHolder.png');
    });  
});

var getProfileAndPics = () => {
    console.log('window.location.pathname', window.location.pathname);

    $.ajax({ 
        type: 'GET',
        url: '/api/get-profile',
        success: (response) => {
            userId = response.user.twitter.id;
            
            console.log('From getProfileAndPics: userId', userId);
            
            getPics();
        },
        error: (response) => {
            console.log('error getting prof');
            
            getPics();
        }
    });     
};

var getPics = () => {
    var isOnHomePage = window.location.pathname === '/';
    
    $.ajax({ 
        type: 'GET',
        url: isOnHomePage ? '/api/pics' : '/api/my-pics',
        success: (pics) => {
            addPicsToPage(pics);
        }
    });      
};

var fadeInOutAlert = (id, type, text) => {
    var alert =
        `<div class="alert alert-${type}">
            ${text}
        </div>`;
        
    $(id).append(alert);
    
    setTimeout(() => {
        $(id).children().remove();
    }, 3000);
}

var submitAddPicForm = () => {
    $.ajax({ 
        type: "POST",
        url: '/api/add-pic',
        data: $('#add-pic-form').serializeArray(),
        success: (response) => {
            fadeInOutAlert('#add-pic-alert', 'success', 'You\'re pic has been uploaded! Add another one or refresh the page to see it!');
        },
        error: (response) => {
            fadeInOutAlert('#add-pic-alert', 'warning', 'You need to <strong>login</strong> before you can add a pic.');
        }
    });
    
    return false;
};

var deletePic = (picId) => {
    $.ajax({ 
        type: 'POST',
        url: '/api/delete-pic/' + picId,
        success: (response) => {
            window.location.reload();
        },
        error: () => {
            console.log('error deleting pic');
        }
    });        
};

var createPicElem = (pic) => {
    var elem;
    
    console.log('Line 81: userId', userId);
    
    if (pic.ownerId === userId) {
        elem =
            `<div class="grid-item grid-item--width2 grid-item--height3">
                <img src=${pic.link} alt=${pic.title}> 
                <p>${pic.title}</p>
                <p>${pic.owner}</p>
                <button class="btn btn-default" onclick="deletePic('${pic._id}')">Remove</button>
            </div>`;
    } else {
        elem =
            `<div class="grid-item grid-item--width2 grid-item--height3">
                <img src=${pic.link} alt=${pic.title}> 
                <p>${pic.title}</p>
                <p>${pic.owner}</p>
            </div>`;            
    }
        
    return elem;
};

var addPicsToPage = (pics) => {
    pics.map((pic) => {
        var pic = createPicElem(pic);
        $('.grid').append(pic);
    });
};