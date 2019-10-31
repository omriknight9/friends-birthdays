
let friends = [];
let counter = 1;
let lang = 1;

let d = new Date();
let currentYear = d.getFullYear();
let sortBtnCounter = 1;

$(document).ready(function (event) {
    loadJson('./lists/friends.txt');

    if (window.location.href.indexOf("lang=he") > -1) {
        setTimeout(function(){
            changeToHeb();
            window.history.pushState('page2', 'Title', 'index.html');
        }, 600)
    }

    $('#langBtnHe').click(function () {
        changeToHeb();
    })

    $('#langBtnEn').click(function () {
        changeToEng();
    })

    window.onbeforeunload = function () {
        window.scrollTo(0, 0);
    }

    window.onscroll = function () {
        scrollBtn();
    }

    $('.Xbtn').click(function () {
        $(this).parent().parent().fadeOut(150);
    })

    setTimeout(function () {
        $('.spinnerWrapper').hide();
        $('.searchContainer').show();
        $('.btnWrapper').css('opacity', 1);
    }, 1500);

    $('#search').on('input', function () {
        $('#searchResults').empty();
        $.each($('.personWrapper'), function (key, value) {
            for (let i = 0; i < $(this).length; i++) {
                let personName;
                let personNameHeb;
                let personNameCapital;

                personName = $($(this)[i]).attr('name').toLowerCase();
                personNameHeb = $($(this)[i]).attr('nameHeb');

                let personImg = $($(this)[i]).attr('img');
                let searchVal = $('#search').val();
                let searchValCapitalized = searchVal.charAt(0).toUpperCase() + searchVal.slice(1);

                if (searchVal.length == 0) {
                    $('#searchResults').hide();
                } else {
                    $('#searchResults').show();
                }

                if (lang == 1) {
                    personNameCapital = personName[0].toUpperCase() + personName.substr(1);
                } else {
                    personNameCapital = personNameHeb[0].toUpperCase() + personNameHeb.substr(1);
                }

                if (personName.includes(searchValCapitalized) || personName.includes(searchValCapitalized.toLowerCase()) || personNameHeb.includes(searchValCapitalized)) {
                    let result = $('<div>', {
                        class: 'result',
                        click: function() {

                            let that = this;
                            let pickedName = $(that).find($('.resultName')).html();
                            $.each($('.personWrapper'), function (key, value) {
                                if (pickedName == $(this).attr('name') || pickedName == $(this).attr('nameHeb')) {
                                    $('body').css('pointer-events', 'none');
                                    let selectedDiv = this;
                                    $('#searchResults').hide();
                                    $('#search').val('');

                                    if ($(this).attr('isParent') == 1) {
                                        goToDiv($(this).parent().parent());
                                    } else {
                                        goToDiv($(this).parent());
                                    }

                                    setTimeout(function() {
                                        $(selectedDiv).click();
                                        $('body').css('pointer-events', 'all');
                                    }, 1500)
                                }
                            });
                        }
                    }).appendTo($('#searchResults'));

                    let resultImgWrapper = $('<div>', {
                        class: 'resultImgWrapper',
                    }).appendTo(result);

                    let resultImg = $('<img>', {
                        class: 'resultImg',
                        src: './images/people' + personImg
                    }).appendTo(resultImgWrapper);

                    let resultName = $('<p>', {
                        class: 'resultName',
                        text: personNameCapital
                    }).appendTo(result);
                }
            }
        });
    })
});

function showFriends() {
    $('.container').empty();
    friends = [];
    counter = 1;
    $('.btnWrapper').css('opacity', 0);
    $('.spinnerWrapper').show();

    setTimeout(function () {
        loadJson('./lists/friends.txt');
    }, 500);

    $('.sortContainer').fadeOut('fast');
    sortBtnCounter = 1
}

function sort() {
    if (sortBtnCounter == 1) {
        $('.sortContainer').fadeIn('fast');
        sortBtnCounter = 2;
    } else {
        $('.sortContainer').fadeOut('fast');
        sortBtnCounter = 1;
    }
}

function loadJson(textFile) {
    $.get(textFile, function (data) {
        friends.push(JSON.parse(data));
        setTimeout(function () {
            buildPeople('friendsWrapper', $('.container'), friends);
            $('body').css('background-color', '#3fe09b');
        }, 500);
    });
}

function goToDiv(div) {
    $('html, body').animate({ scrollTop: $(div).position().top -170 }, 1500);
}

function buildPeople(div, wrapper, arr) {

    var people = arr[0].friends;
    var date = new Date();
    var year = date.getFullYear();
    var birthday;

    for (var i = 0; i < people.length; i++) {
        var groupStr = JSON.stringify(people[i].group);
        var group = groupStr.substring(0, groupStr.indexOf('.'));

        var groupWrapper;

        if ($(groupWrapper).hasClass("group" + group)) {

        } else {
            groupWrapper = $('<div>', {
                class: "group" + group + ' groupWrapper'
            }).appendTo(wrapper);

            var parentDiv = $('<div>', {
                class: 'parentDiv'            
            }).appendTo(groupWrapper);

            if (group % 2 == 0) {
                $(groupWrapper).addClass('evenGroup');
            } else {
                $(groupWrapper).addClass('oddGroup');
            }
        }

        var nameToShow;

        if (lang == 1) {
            nameToShow = people[i].name;
        } else {
            nameToShow = people[i].nameHeb;
        }

        var dateNow = new Date();
        var monthNow = dateNow.getMonth() + 1;
        var yearNow = dateNow.getFullYear();

        var date = new Date(people[i].birthday);
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var yearToShow = date.getFullYear();

        if (day < 10) {
            day = '0' + day
        } else {
            day = day;
        }

        if (month < 10) {
            month = '0' + month
        } else {
            month = month;
        }

        var calendar = month + '/' + day;
        var dateForShow = day + '/' + month + '/' + yearToShow;

        var personWrapper = $('<div>', {
            class: 'personWrapper',
            'birthday': people[i].birthday,
            'name': people[i].name,
            'nameHeb': people[i].nameHeb,
            'group': people[i].group,
            'img': people[i].image,
            'isParent': people[i].parent,
            'gender': people[i].gender,
            'facebook': people[i].facebook,
            'instagram': people[i].instagram,
            'calendar': calendar,
            click: function () {

                if ($(this).attr('facebook') == 'null') {
                    $('#facebookLink').hide();
                } else {
                    $('#facebookLink').show();
                    $('#facebookLink').attr('href', 'https://www.facebook.com' + $(this).attr('facebook'));
                }

                if ($(this).attr('instagram') == 'null') {
                    $('#instagramLink').hide();
                } else {
                    $('#instagramLink').show();
                    $('#instagramLink').attr('href', 'https://www.instagram.com' + $(this).attr('instagram'));
                }

                $('#checkBirthdaysLink').attr('href', 'https://omriknight9.github.io/birthdays' + '?name=' + $(this).attr('name') + '&day=' + $(this).attr('day') + '&month=' + $(this).attr('month'));

                if (lang == 1) {
                    $('.personNamePop').html($(this).attr('name'));
                } else {
                    $('.personNamePop').html($(this).attr('nameHeb'));
                }

                $('#personCover').attr('src', ('./images/people' + $(this).attr('img')));
                $('.start').html($(this).attr('calendar') + '08:00 AM');
                $('.end').html($(this).attr('calendar') + '10:00 AM');
                if (lang == 1) {
                    $('.title').html($(this).attr('name') + "'s Birthday");
                    $('.location').html($(this).attr('name') + "'s Home");
                    $('.nextBirthday').html('Next Birthday Will Be On ' + $(this).attr('nextBirthday'));
                } else {
                    $('.title').html('יומולדת ל' + $(this).attr('nameHeb'));
                    $('.location').html('הבית של ' + $(this).attr('nameHeb'));
                    $('.nextBirthday').html('היומולדת הבא יהיה ביום ' + $(this).attr('nextBirthday'));
                }

                $('#personDetails').fadeIn(150);

                if ($(this).attr('gender') == 1) {
                    $('#personDetails .popupCont').css('background-color', 'lightblue');
                } else {
                    $('#personDetails .popupCont').css('background-color', 'pink');
                }
            }
        })

        var gender;

        if ($(personWrapper).attr('gender') == 1) {
            gender = 'male.png';
            $(personWrapper).addClass('boy');
            if (day == dateNow.getDate() && monthNow == month) {
                $(personWrapper).addClass('boyBornToday');
            }
        } else {
            gender = 'female.png';
            $(personWrapper).addClass('girl');
            if (day == dateNow.getDate() && monthNow == month) {
                $(personWrapper).addClass('girlBornToday');
            }
        }
        
        if (lang == 1) {
            birthday = 'Birthday: ';
        } else {
            birthday = 'יומולדת: '
        }

        var genderImg = $('<img>', {
            class: 'genderImg',
            src: './images/' + gender,
            alt: 'gender img'
        }).appendTo(personWrapper);

        var zodiacImg = $('<img>', {
            class: 'zodiacImg',
            src: './images/zodiac' + people[i].zodiac,
            alt: 'zodiac img'
        }).appendTo(personWrapper);

        var age = yearNow - yearToShow;

        if ($(personWrapper).attr('isParent') == 1) {
            $(personWrapper).appendTo(parentDiv);
            if ($(personWrapper).attr('gender') == 1) {
                $(personWrapper).addClass('suit');
                // buildCloths('suitImg', 'suit', 'suit img', personWrapper);
            } else {
                // buildCloths('dressImg', 'dress', 'dress img', personWrapper);
            }

        } else {
            if ($(personWrapper).attr('gender') == 1) {
                // buildCloths('babyBoyImg', 'babyBoy', 'baby boy img', personWrapper);
            } else {
                // buildCloths('babyGirlImg', 'babyGirl', 'baby girl img', personWrapper);
            }
            $(personWrapper).appendTo(groupWrapper);
        }

        var selectedDate = new Date($(personWrapper).attr('calendar') + '/' + year);

        if (selectedDate < d) {
            $(personWrapper).attr('calendar', $(personWrapper).attr('calendar') + '/' + Number(year + 1));
        } else {
            $(personWrapper).attr('calendar', $(personWrapper).attr('calendar') + '/' + year);
        }

        
        var personDetailsWrapper = $('<div>', {
            class: 'personDetailsWrapper',
        }).appendTo(personWrapper);

        var personName = $('<p>', {
            class: 'personName',
            text: nameToShow
        }).appendTo(personDetailsWrapper);

        var personBirthday = $('<p>', {
            class: 'personBirthday',
            text: birthday + dateForShow
        }).appendTo(personDetailsWrapper);

        var personImgWrapper = $('<div>', {
            class: 'personImgWrapper',
        }).appendTo(personWrapper);

        var personImg = $('<img>', {
            class: 'personImg',
            alt: 'personImg',
            src: './images/people' + people[i].image
        }).appendTo(personImgWrapper);
    }

    setTimeout(function () {
        checkAge();
        $('.btnWrapper').css('opacity', 1);
        $('.spinnerWrapper').hide();
    }, 0);
}

function checkAge() {
    $.each($('.personWrapper'), function (key, value) {
        getAge($(this), $(this).attr('birthday'), $(this).attr('calendar'));
    });
}

function buildCloths(param, img, alt, wrapper) {
    
    var param = $('<img>', {
        class: 'clothesImg',
        id: img,
        src: './images/' + img + '.png',
        alt: alt
    }).appendTo(wrapper);
}

function getAge(div, dateString, calendar) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var calendarBirthday = new Date(calendar);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    var ageText;

    var month = calendarBirthday.getMonth() + 1;
    var day = calendarBirthday.getDate();

    var daysEng = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var daysHeb = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        if (lang == 1) {
            $(div).attr('nextBirthday', daysEng[calendarBirthday.getDay()]);
        } else {
            $(div).attr('nextBirthday', daysHeb[calendarBirthday.getDay()]);
        }
        
        age--;
    } else {
        calendarBirthday.setFullYear(calendarBirthday.getFullYear());
        if (lang == 1) {
            $(div).attr('nextBirthday', daysEng[calendarBirthday.getDay()]);
        } else {
            $(div).attr('nextBirthday', daysHeb[calendarBirthday.getDay()]);
        }
    }

    if (age == 0) {
        if (lang == 1) {
            age = today.getMonth() - (birthDate.getMonth() + 1) + ' Months';
        } else {
            age = today.getMonth() - (birthDate.getMonth() + 1) + ' חודשים';
        }
    }

    $(div).attr('age', age);
    $(div).attr('month', month);
    $(div).attr('day', day);

    if (lang == 1) {
        ageText = 'Age: ';
    } else {
        ageText = 'גיל: ';
    }

    var personAge = $('<p>', {
        class: 'personAge',
        text: ageText + age
    }).appendTo($(div).find($('.personDetailsWrapper')));

    return age;
}

function goToTop() {
    $('html,body').animate({ scrollTop: 0 }, 'slow');
}

function scrollBtn() {

    if ($(this).scrollTop() > 550) {
        $('.goToTopBtn').fadeIn();
    }
    else {
        $('.goToTopBtn').fadeOut();
    }
}

function sortFriends(elem1, kind) {

    $('.groupWrapper').removeClass('oddGroup');
    $('.groupWrapper').removeClass('evenGroup');

    if (elem1 == 'calendar') {
        counter = 2;
    }

    else if ($('.btnWrapper').attr('kind') == kind) {

    }

    else {
        $('.btnWrapper').attr('kind', kind);
        counter = 1;
    }

    if (kind == 3) {
        $('.container').empty();
    }

    $.each($('.container'), function (key, value) {
        var ids = [], obj, i, len;
        var children = $(this).find('.personWrapper');
        for (i = 0, len = children.length; i < len; i++) {
            obj = {};
            obj.element = children[i];
            var elem2 = $(children[i]).attr(elem1);
            switch (kind) {
                case 1:
                    obj.idNum = new Date(elem2);
                    break;
                case 2:
                    obj.idNum = elem2;
                    break;
                case 3:
                    obj.idNum = parseInt(elem2.replace(/[^\d]/g, ""), 10);
                    break;
            }
            ids.push(obj);
        }

        switch (kind) {
            case 1:
                switch (counter) {
                    case 1:
                        ids.sort(function (a, b) { return (b.idNum - a.idNum); });
                        counter = 2;
                        break;
                    case 2:
                        ids.sort(function (a, b) { return (a.idNum - b.idNum); });
                        counter = 1;
                        break;
                }
                $('.btnWrapper').attr('kind', kind);
                $('.groupSortBtn').css('pointer-events', 'all');
                break;
            case 2:
                switch (counter) {
                    case 1:
                        ids.sort(function (a, b) {
                            if (a.idNum > b.idNum) {
                                return 1;
                            } else {
                                return -1;
                            }
                        });

                        counter = 2;
                        break;

                    case 2:
                        ids.sort(function (a, b) {
                            if (a.idNum < b.idNum) {
                                return 1;
                            } else {
                                return -1;
                            }
                        });
                        counter = 1;
                        break;
                }
                $('.btnWrapper').attr('kind', kind);
                $('.groupSortBtn').css('pointer-events', 'all');
                break;
            case 3:
                $('.spinnerWrapper').show();
                $('.btnWrapper').css('opacity', 0);
                $('.groupSortBtn').css('pointer-events', 'none');
                showFriends();
                setTimeout(function () {
                    $('.btnWrapper').css('opacity', 1);
                    $('.spinnerWrapper').hide();
                }, 500);
                break;
        }

        for (i = 0; i < ids.length; i++) {
            $(this).append(ids[i].element);
        }
    });

    $('.sortContainer').fadeOut('fast');
    sortBtnCounter = 1
}

function removePopup(container) {

    $(document).mouseup(function (e) {
        if (container.is(e.target) && container.has(e.target).length === 0) {
            container.hide();
            e.stopPropagation();
            $(document).off('mouseup');
        }
    })
}

function closeCurrentPopup(that) {
    $($(that)[0].parentElement.parentElement.parentElement).fadeOut(150);
}
