function changeToHeb() {

    lang = 2;
    $('#langBtnHe').css('pointer-events', 'none');
    $('#langBtnEn').css('pointer-events', 'all');

    $("head").append("<link rel='stylesheet' type='text/css' href='css/main_he.css' id='hebCss'/>");
    $('title').html('ימי הולדת - חברים');

    $('h1').hide().html('ימי הולדת - חברים').fadeIn('slow');
    $('#search').hide().attr('placeholder', 'חפש בחברים').fadeIn('slow');

    $('.sortBtn').hide().html('סדר').fadeIn('slow');

    $('.ageSortBtn').hide().html('לפי גיל').fadeIn('slow');
    $('.nameSortBtn').hide().html('לפי שם').fadeIn('slow');
    $('.groupSortBtn').hide().html('לפי קבוצה').fadeIn('slow');
    $('.calendarSortBtn').hide().html('לפי תאריך').fadeIn('slow');

    $('#checkBirthdaysLink').hide().html('בדוק באיזה יום נופל היומולדת בשנים הקרובות').fadeIn('slow');

    $('.hebCaneldar').show();
    $('.engCaneldar').hide();

    $('.popupBtn').hide().html('סגור').fadeIn('slow');

    showFriends();
}

function changeToEng() {
    lang = 1;
    $('#langBtnEn').css('pointer-events', 'none');
    $('#langBtnHe').css('pointer-events', 'all');

    $('#hebCss').remove();
    $('title').html('Friends Birthdays');
    $('h1').hide().html('Friends Birthdays').fadeIn('slow');
    $('#search').hide().attr('placeholder', 'Search A Friend').fadeIn('slow');

    $('.sortBtn').hide().html('Sort').fadeIn('slow');

    $('.ageSortBtn').hide().html('By Age').fadeIn('slow');
    $('.nameSortBtn').hide().html('By Name').fadeIn('slow');
    $('.groupSortBtn').hide().html('By Group').fadeIn('slow');
    $('.calendarSortBtn').hide().html('By Date').fadeIn('slow');

    $('#checkBirthdaysLink').hide().html('Check What Day Is The Birthday For Upcoming Years').fadeIn('slow');

    $('.hebCaneldar').hide();
    $('.engCaneldar').show();

    $('.popupBtn').hide().html('Close').fadeIn('slow');

    showFriends();
}
