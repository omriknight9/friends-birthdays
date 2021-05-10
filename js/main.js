
let friends = [];
let counter = 1;
let lang = 1;

let now = new Date();
let currentYear = now.getFullYear();
let sortBtnCounter = 1;

let birthdayArr = [];
let birthdayToday = false;

let searchVal;
let lastChar;

const hebCalendarUrl = 'https://www.hebcal.com/converter?cfg=json';

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
        $('#search').val('');
        $('#searchResults').hide();
        if (birthdayToday) {
            $('.personWrapper').first().remove();
        }
    })

    $('#langBtnEn').click(function () {
        changeToEng();
        $('#search').val('');
        $('#searchResults').hide();
        if (birthdayToday) {
            $('.personWrapper').first().remove();
        }
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
        searchVal = $('#search').val();
        lastChar = searchVal.substr(searchVal.length - 1);

        if (lastChar == ' ') {
            return; 
        } else {
            $('#searchResults').empty();
            $('#searchResults').hide();
        }

        $.each($('.container .personWrapper'), function (key, value) {
            let friendNumId = $(value).attr('numId');
            showResult($(this), friendNumId);
        });
    })
});

function showResult(that, resultNum) {
    for (let i = 0; i < $(that).length; i++) {
        let personName = $($(that)[i]).attr('name').toLowerCase();
        let personNameHeb = $($(that)[i]).attr('nameHeb');
        let personNameCapital;
        let personImg = $($(that)[i]).attr('img');
        let searchVal = $('#search').val();
        let searchValCapitalized = searchVal.charAt(0).toUpperCase() + searchVal.slice(1);

        let cap;
        let serachFinal;

        if (lang == 1) {
            personNameCapital = personName.toUpperCase();
        } else {
            personNameCapital = personNameHeb.toUpperCase();
        }

        try {
            if (lang == 1) {
                cap = capitalize(personName);
            } else {
                cap = personNameHeb;
            }
            
            serachFinal = capitalize(searchValCapitalized);
        } catch (error) {
            return;
        }

        if (cap.includes(serachFinal) || cap.includes(serachFinal.toLowerCase()) || personNameHeb.includes(serachFinal)) {
            let result = $('<div>', {
                class: 'result',
                id: resultNum,
                click: function() {

                    let that = this;
                    let pickedId = $(that).attr('id');
                    $.each($('.container .personWrapper'), function (key, value) {

                        if ($(this).attr('numId') == pickedId) {
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
                text: cap
            }).appendTo(result);
        }

        if (searchVal.length == 0 || $('.result').length < 1) {
            $('#searchResults').hide();
        } else {
            $('#searchResults').show();
        }
    }
}

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
            // $('body').css('background-color', '#3fe09b');
            $('body').css('background-image', 'linear-gradient(180deg,rgba(200, 200, 200, .95), rgba(50,50,50,.95))');
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
            'numId': people[i].id,
            'birthday': people[i].birthday,
            'name': people[i].name,
            'nameHeb': people[i].nameHeb,
            'group': people[i].group,
            'img': people[i].image,
            'isParent': people[i].parent,
            'married': people[i].married,
            'gender': people[i].gender,
            'facebook': people[i].facebook,
            'instagram': people[i].instagram,
            'calendar': calendar,
            'year': yearToShow,
            'afterSunset': people[i].afterSunset,
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

                $('.hebBirthday').html('');

                switch($(this).attr('afterSunset')) {
                    case 'true':
                        $.get(hebCalendarUrl + `&gy=${$(this).attr('year')}&gm=${$(this).attr('month')}&gd=${$(this).attr('day')}&2h=1&gs=on`, function (data) {
                            $('.hebBirthday').html(data.hebrew);
                        });
                        break;
                    case 'false':
                        $.get(hebCalendarUrl + `&gy=${$(this).attr('year')}&gm=${$(this).attr('month')}&gd=${$(this).attr('day')}&2h=1`, function (data) {
                            $('.hebBirthday').html(data.hebrew);
                        });
                        break;
                    case 'null':
                        $.get(hebCalendarUrl + `&gy=${$(this).attr('year')}&gm=${$(this).attr('month')}&gd=${$(this).attr('day')}&2h=1`, function (data) {
                            $('.hebBirthday').html(data.hebrew);
                        });
                        $.get(hebCalendarUrl + `&gy=${$(this).attr('year')}&gm=${$(this).attr('month')}&gd=${$(this).attr('day')}&2h=1&gs=on`, function (data) {
                            $('.hebBirthday').append('/' + data.hebrew);
                        });
                        break;
                }

                $('#personDetails').fadeIn(150);

                if ($(this).attr('gender') == 1) {
                    $('#personDetails .popupCont').css('background-color', 'lightblue');
                } else {
                    $('#personDetails .popupCont').css('background-color', 'pink');
                }
            }
        })

        let gender;
        let newDay;
        let newMonth;

        if ($(personWrapper).attr('gender') == 1) {
            gender = 'male.webp';
            $(personWrapper).addClass('boy');

            if (day.toString().charAt(0) == '0') {
                newDay = day.replace('0', '');
            } else {
                newDay = day;
            }

            if (month.toString().charAt(0) == '0') {
                newMonth = month.replace('0', '');
            } else {
                newMonth = month;
            }

            if (newDay == now.getDate() && (now.getMonth() + 1) == newMonth) {
                $(personWrapper).addClass('boyBornToday');
            }

        } else {
            gender = 'female.webp';
            $(personWrapper).addClass('girl');

            if (day.toString().charAt(0) == '0') {
                newDay = day.replace('0', '');
            } else {
                newDay = day;
            }

            if (month.toString().charAt(0) == '0') {
                newMonth = month.replace('0', '');
            } else {
                newMonth = month;
            }

            if (newDay == now.getDate() && (now.getMonth() + 1) == newMonth) {
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

        let zodiac;

        switch(month) {
            case '01': case 01:
                if (day < 20) {
                    zodiac = '/capricorn.webp';
                } else {
                    zodiac = '/aquarius.webp';
                }
                break;
            case '02': case 02:
                if (day < 19) {
                    zodiac = '/aquarius.webp';
                } else {
                    zodiac = '/pisces.webp';
                }
                break;
            case '03': case 03:
                if (day < 21) {
                    zodiac = '/pisces.webp';
                } else {
                    zodiac = '/aries.webp';
                }
                break;
            case '04': case 04:
                if (day < 20) {
                    zodiac = '/aries.webp';
                } else {
                    zodiac = '/taurus.webp';
                }
                break;
            case '05': case 05:
                if (day < 21) {
                    zodiac = '/taurus.webp';
                } else {
                    zodiac = '/gemini.webp';
                }
                break;
            case '06': case 06:
                if (day < 21) {
                    zodiac = '/gemini.webp';
                } else {
                    zodiac = '/cancer.webp';
                }
                break;
            case '07': case 07:
                if (day < 23) {
                    zodiac = '/cancer.webp';
                } else {
                    zodiac = '/leo.webp';
                }
                break;
            case '08': case 08:
                if (day < 23) {
                    zodiac = '/leo.webp';
                } else {
                    zodiac = '/virgo.webp';
                }
                break;
            case '09': case 09:
                if (day < 23) {
                    zodiac = '/virgo.webp';
                } else {
                    zodiac = '/libra.webp';
                }
                break;
            case '10': case 10:
                if (day < 23) {
                    zodiac = '/libra.webp';
                } else {
                    zodiac = '/scorpio.webp';
                }
                break;
            case '11': case 11:
                if (day < 22) {
                    zodiac = '/scorpio.webp';
                } else {
                    zodiac = '/sagittarius.webp';
                }
                break;
            case '12': case 12:
                if (day < 22) {
                    zodiac = '/sagittarius.webp';
                } else {
                    zodiac = '/capricorn.webp';
                }
                break;
        }

        var zodiacImg = $('<img>', {
            class: 'zodiacImg',
            src: './images/zodiac' + zodiac,
            alt: 'zodiac img'
        }).appendTo(personWrapper);

        var age = yearNow - yearToShow;

        if ($(personWrapper).attr('isParent') == 1) {
            $(personWrapper).appendTo(parentDiv);
            if ($(personWrapper).attr('gender') == 1) {
                $(personWrapper).addClass('suit');
                buildCloths('suitImg', 'suit', 'suit img', personWrapper);
            } else {
                buildCloths('dressImg', 'dress', 'dress img', personWrapper);
            }

        } else {
            if ($(personWrapper).attr('gender') == 1) {
                if (age < 5) {
                    buildCloths('babyBoyImg', 'babyBoy', 'baby boy img', personWrapper);
                } else {
                    if ($(personWrapper).attr('married') == 1) {
                        buildCloths('suitImg', 'suit', 'suit img', personWrapper);
                    } else {
                        buildCloths('boyImg', 'boy', 'boy img', personWrapper);
                    }
                }
            } else {
                if (age < 5) {
                    buildCloths('babyGirlImg', 'babyGirl', 'baby girl img', personWrapper);
                } else {
                    if ($(personWrapper).attr('married') == 1) {
                        buildCloths('dressImg', 'dress', 'dress img', personWrapper);
                    } else {
                        buildCloths('girlImg', 'girl', 'girl img', personWrapper);
                    }
                }
            }
            $(personWrapper).appendTo(groupWrapper);
        }

        var selectedDate = new Date($(personWrapper).attr('calendar') + '/' + year);

        if (selectedDate < now) {
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
        checkClosest();
        $('.btnWrapper').css('opacity', 1);
        $('.spinnerWrapper').hide();
    }, 0);
}

function checkClosest() {
    let year;
    birthdayArr = [];

    for (let i = 0; i < $('.groupWrapper .personWrapper').length; i++) {
        let name = $($('.groupWrapper .personWrapper')[i]).attr('name');
        let nameHeb = $($('.groupWrapper .personWrapper')[i]).attr('nameHeb');
        let birthdayDay = $($('.groupWrapper .personWrapper')[i]).attr('day');
        let birthdayMonth = $($('.groupWrapper .personWrapper')[i]).attr('month');
        let gender = $($('.groupWrapper .personWrapper')[i]).attr('gender');
        let img = $($('.groupWrapper .personWrapper')[i]).attr('img');
        let date = new Date(now.getFullYear() + '/' + birthdayMonth + '/' + birthdayDay);

        if (now.getDate() == birthdayDay && now.getMonth() + 1 == birthdayMonth) {
            year = now.getFullYear();
            birthdayToday = true;
        } else if (date < now) {
            year = now.getFullYear() + 1;
        } else {
            year = now.getFullYear();
        }
        
        var finalDate = new Date(year + '/' + birthdayMonth + '/' + birthdayDay);
        birthdayArr.push({name: name, gender: gender, nameHeb: nameHeb, date: finalDate, img: img});  
    }

    setTimeout(function() {
        birthdayArr.sort(function(a, b) {
            var distancea = Math.abs(now - a.date);
            var distanceb = Math.abs(now - b.date);
            return distancea - distanceb;
        });

        if (lang == 1) {
            let gender;
            if (birthdayToday) {
                $.each($('.personWrapper'), function (key, value) {
                    if ($(value).attr('month') == now.getMonth() + 1 && $(value).attr('day') == now.getDate()) {
                        $(value).clone().appendTo($('#birthdayToday'));
                        if ($(value).attr('gender') == 1) {
                            gender = 1;
                        } else {
                            gender = 2;
                        }
                    }
                });

                $.each($('#birthdayToday .personWrapper'), function (key, value) {

                    let closest = $('<p>',{
                        class: 'closestBirth',
                        text: "It's "

                    }).insertAfter($('.spinnerWrapper'));

                    let closestSpanName = $('<span>',{
                        class: 'birthdayColor',
                        text: birthdayArr[key].name
                    }).appendTo(closest);
                 
                    let closestSpan = $('<span>',{
                        class: 'closestSpan',
                        text: "'s" + " Birthday Today!"
                    }).appendTo(closest);

                    let birthdayWish = $('<p>', {
                        class: 'birthdayWish'
                    }).insertAfter(closest);

                    if ($(value).attr('facebook') !== 'null') {
                        let birthdayText;
                        if (birthdayArr[key].gender == 1) {
                            birthdayText = 'Wish Him Happy Birthday';
                        } else {
                            birthdayText = 'Wish Her Happy Birthday';
                        }

                        let facebookTest = $('<a>', {
                            href: 'https://www.facebook.com' + $(value).attr('facebook'),
                            target: '_blank',
                            text: birthdayText
                        }).appendTo(birthdayWish);
                    }

                    $(value).click(function() {
                        goToBirthdayPerson($(value).attr('numid'));
                    })

                    if (birthdayArr[key].gender == 1) {
                        $(closestSpanName).css('color', 'lightblue');
                    } else {
                        $(closestSpanName).css('color', 'pink');
                    }
                });
                
            } else {

                let closest = $('<p>',{
                    class: 'closestBirth',
                    text: 'Closest Birthday: '
                }).insertAfter($('.spinnerWrapper'));

                let closestSpan = $('<span>', {
                    class: 'birthdayColor',
                    text: birthdayArr[0].name
                }).appendTo(closest);

                if (birthdayArr[0].gender == 1) {
                    $('.birthdayColor').css('color', 'lightblue');
                } else {
                    $('.birthdayColor').css('color', 'pink');
                }

                if ($(window).width() > 765) {
                    $('.closestBirth').mouseenter(function () {
                        if (!$('#searchResults').is(':visible')) {
                            let hoverImgContainer = $('<div>', {
                                class: 'hoverImgContainer',
                            }).hide().appendTo($('.closestBirth')).fadeIn();
                            
                            let hoverImgWrapper = $('<div>', {
                                class: 'hoverImgWrapper',
                            }).appendTo(hoverImgContainer);
            
                            let hoverImg = $('<img>', {
                                class: 'hoverImg',
                                src: './images/people' + birthdayArr[0].img
                            }).appendTo(hoverImgWrapper)
                        }
                    });
                 
                    $('.closestBirth').mouseleave(function () {
                        $('.hoverImgContainer').fadeOut(400);
                        $('.closestBirth').css('pointer-events', 'none');
                        setTimeout(function() {
                            $('.hoverImgContainer').remove();
                            $('.closestBirth').css('pointer-events', 'all');
                        }, 600);
                    }).mouseleave()
                }
            }

        } else {
            if (birthdayToday) {
                $.each($('.personWrapper'), function (key, value) {
                    if ($(value).attr('month') == now.getMonth() + 1 && $(value).attr('day') == now.getDate()) {
                        $(value).clone().appendTo($('#birthdayToday'));
                        if ($(value).attr('gender') == 1) {
                            gender = 1;
                        } else {
                            gender = 2;
                        }
                    }
                });

                $.each($('#birthdayToday .personWrapper'), function (key, value) {

                    let closest = $('<p>',{
                        class: 'closestBirth',
                    }).insertAfter($('.spinnerWrapper'));

                    let closestSpanName = $('<span>',{
                        class: 'birthdayColor',
                        text: birthdayArr[key].nameHeb
                    }).appendTo(closest);

                    let celebrateText;
                    let wishText;

                    if ($(value).attr('gender') == 1) {
                        celebrateText = ' חוגג היום!';
                        wishText = 'אחל/י לו יום הולדת שמח';
                    } else {
                        celebrateText = ' חוגגת היום!';
                        wishText = 'אחל/י לה יום הולדת שמח';
                    }
                    
                    let closestSpan = $('<span>',{
                        class: 'closestSpan',
                        text: celebrateText
                    }).appendTo(closest);


                    let birthdayWish = $('<p>', {
                        class: 'birthdayWish'
                    }).insertAfter(closest);

                    if ($(value).attr('facebook') !== 'null') {
                        let facebookTest = $('<a>', {
                            href: 'https://www.facebook.com' + $(value).attr('facebook'),
                            target: '_blank',
                            text: wishText
                        }).appendTo(birthdayWish);
                    }

                    $(value).click(function() {
                        goToBirthdayPerson($(value).attr('numid'));
                    })

                    if (birthdayArr[key].gender == 1) {
                        $(closestSpanName).css('color', 'lightblue');
                    } else {
                        $(closestSpanName).css('color', 'pink');
                    }
                });
                
            } else {

                let closest = $('<p>',{
                    class: 'closestBirth',
                    text: 'החוגג הקרוב: '
                }).insertAfter($('.spinnerWrapper'));

                let closestSpan = $('<span>', {
                    class: 'birthdayColor',
                    text: birthdayArr[0].nameHeb
                }).appendTo(closest);

                if (birthdayArr[0].gender == 1) {
                    $('.birthdayColor').css('color', 'lightblue');
                } else {
                    $('.birthdayColor').css('color', 'pink');
                }

                if ($(window).width() > 765) {
                    $('.closestBirth').mouseenter(function () {
                        if (!$('#searchResults').is(':visible')) {
                            let hoverImgContainer = $('<div>', {
                                class: 'hoverImgContainer',
                            }).hide().appendTo($('.closestBirth')).fadeIn();
                            
                            let hoverImgWrapper = $('<div>', {
                                class: 'hoverImgWrapper',
                            }).appendTo(hoverImgContainer);
            
                            let hoverImg = $('<img>', {
                                class: 'hoverImg',
                                src: './images/people' + birthdayArr[0].img
                            }).appendTo(hoverImgWrapper)
                        }
                    });
                 
                    $('.closestBirth').mouseleave(function () {
                        $('.hoverImgContainer').fadeOut(400);
                        $('.closestBirth').css('pointer-events', 'none');
                        setTimeout(function() {
                            $('.hoverImgContainer').remove();
                            $('.closestBirth').css('pointer-events', 'all');
                        }, 600);
                    }).mouseleave()
                }
            }
        }
    }, 1000);
}

function goToBirthdayPerson(id) {
    
    $.each($('.container .personWrapper'), function (key, value) {
        if ($(value).attr('numId') == id) {
            $(value).click();
        }
    });
}

function checkAge() {
    $.each($('.personWrapper'), function (key, value) {
        getAge($(this), $(this).attr('birthday'), $(this).attr('calendar'));
    });
}

function buildCloths(param, img, alt, wrapper) {
    
    var param = $('<img>', {
        class: 'clothesImg ' + img,
        // id: img,
        src: './images/' + img + '.webp',
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

        let finalAge;
        let finalMonth;
        let finalDay;

        if (today.getMonth() + 1 < 10) {
            finalMonth = '0' + Math.round(today.getMonth() + 1);
        } else {
            finalMonth = today.getMonth() + 1;
        }
        if (today.getDate() < 10) {
            finalDay = '0' + Math.round(today.getDate());
        } else {
            finalDay = today.getDate();
        }

        let infantAge = finalMonth + '/' + finalDay + '/' + today.getFullYear();
        const date1 = new Date(dateString);
        const date2 = new Date(infantAge);

        finalAge = (date2.getFullYear() - date1.getFullYear()) * 12 + (date2.getMonth() - date1.getMonth());

        if (lang == 1) {
            age = finalAge + ' Months';
        } else {
            age = finalAge + ' חודשים';
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
        // counter = 2;
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

    if (lang == 2 && elem1 == 'name') {
        elem1 = 'nameHeb';
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
                            return a.idNum.localeCompare(b.idNum);
                            // if (a.idNum > b.idNum) {
                            //     return 1;
                            // } else {
                            //     return -1;
                            // }
                        });

                        counter = 2;
                        break;

                    case 2:
                        ids.sort(function (a, b) {
                            return b.idNum.localeCompare(a.idNum);
                            // if (a.idNum < b.idNum) {
                            //     return 1;
                            // } else {
                            //     return -1;
                            // }
                        });
                        counter = 1;
                        break;
                }
                $('.btnWrapper').attr('kind', kind);
                $('.groupSortBtn').css('pointer-events', 'all');
                break;
            case 3:
                $('.closestBirth').html('');
                $('.birthdayWish').html('');
                if (birthdayToday) {
                    $('.personWrapper').first().remove();
                }
                
                $('body').css('background-image', 'unset');
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

function capitalize(str) {
    str = str.split(' ');
    for (let i = 0; i < str.length; i++) {
        str[i] = str[i][0].toUpperCase() + str[i].substr(1);
    }

    return str.join(" ");
}
