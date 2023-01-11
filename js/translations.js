function changeToHeb() {
    $('#birthdayToday').empty();
    $('.closestBirth, .birthdayWish').remove();
    lang = 2;
    $('#langBtnHe').css('pointer-events', 'none');
    $('#langBtnEn').css('pointer-events', 'all');
    $("head").append("<link rel='stylesheet' type='text/css' href='css/main_he.css' id='hebCss'/>");
    $('title').html('ימי הולדת - חברים');
    $('h1').hide().html('ימי הולדת - חברים').fadeIn('slow');
    $('#search').hide().attr('placeholder', 'חפש בחברים').fadeIn('slow');
    $('#closestBirth').html('');
    $('#BirthdayWish').html('');

    $('#checkBirthdaysLink').hide().html('בדוק באיזה יום נופל היומולדת בשנים הקרובות').fadeIn('slow');
    $('.hebCaneldar').show();
    $('.engCaneldar').hide();
    $('.popupBtn').hide().html('סגור').fadeIn('slow');
    showFriends();
}

function changeToEng() {
    $('#birthdayToday').empty();
    $('.closestBirth, .birthdayWish').remove();
    lang = 1;
    $('#langBtnEn').css('pointer-events', 'none');
    $('#langBtnHe').css('pointer-events', 'all');
    $('#hebCss').remove();
    $('title').html('Friends Birthdays');
    $('h1').hide().html('Friends Birthdays').fadeIn('slow');
    $('#search').hide().attr('placeholder', 'Search A Friend').fadeIn('slow');
    $('#closestBirth').html('');
    $('#BirthdayWish').html('');
    $('#checkBirthdaysLink').hide().html('Check What Day Is The Birthday For Upcoming Years').fadeIn('slow');
    $('.hebCaneldar').hide();
    $('.engCaneldar').show();
    $('.popupBtn').hide().html('Close').fadeIn('slow');
    showFriends();
}
