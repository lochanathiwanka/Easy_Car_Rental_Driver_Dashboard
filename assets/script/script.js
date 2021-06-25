function changeScreensStyles(title, css_class, valid_list_item, valid_button, list_items, button_list) {
    $('#screen-title').text(`${title}`);
    $('#screen-logo').attr('class', `${css_class}`);

    $(`#${valid_list_item}`).css("display", "block");

    $(`#${valid_button}`).css({
        "backgroundColor": "#6C63FF",
        "boxShadow": "3px 2px 7px 1px #c3c3c3",
    });
    $(`#${valid_button} > i`).css("color", "#F8F8F8");
    $(`#${valid_button} > span`).css("color", "#F8F8F8");

    for (let i = 0; i < list_items.length; i++) {
        $(`#${list_items[i]}`).css("display", "none");

        $(`#${button_list[i]}`).css({
            "backgroundColor": "#FBFBFB",
            "boxShadow": "none"
        });
        $(`#${button_list[i]} > i`).css("color", "#BCBCBC");
        $(`#${button_list[i]} > span`).css("color", "#BCBCBC");
    }
}

//-------------------------------Load Screens----------------------------------

//load Home screen
$.ajax({
    method: 'GET',
    async: true,
    url: './views/home.html',
    contentType: 'text/html',
    success: (data) => {
        $('#main-container').html(data);
        loginBtnOnClick();
    }
});
$('#btnHome').click(function () {
    let list_items = ['line-btnSchedule'];
    let button_list = ['btnSchedule'];
    changeScreensStyles('Home', 'fas fa-home', 'line-btnHome', 'btnHome', list_items, button_list);

    if (driver_name.length > 0) {
        $.ajax({
            method: 'GET',
            async: true,
            url: './views/profile.html',
            contentType: 'text/html',
            success: (data) => {
                $('#main-container').html(data);
                $('#main-container').html(data);
                $('#txtUID').val(uid);
                $('#txtDID').val(driver_id);
                $('#txtDriver_Name').val(driver_name);
                $('#txtAddress').val(address);
                $('#txtContact').val(contact);
                $('#txtNIC').val(nic);
                $('#txtDRLicense').val(dr_license);
            }
        });
    } else {
        $.ajax({
            method: 'GET',
            async: true,
            url: './views/home.html',
            contentType: 'text/html',
            success: (data) => {
                $('#main-container').html(data);
                loginBtnOnClick();
            }
        });
    }
});
//load Schedule screen
$('#btnSchedule').click(function () {
    let list_items = ['line-btnHome'];
    let button_list = ['btnHome'];
    changeScreensStyles('Schedule', 'fas fa-book-open', 'line-btnSchedule', 'btnSchedule', list_items, button_list);

    $.ajax({
        method: 'GET',
        async: true,
        url: './views/schedule.html',
        contentType: 'text/html',
        success: (data) => {
            $('#main-container').html(data);

            $('#drivers-schedule-table > tbody').empty();
            for (let i = 0; i < schedule_list.length; i++) {
                $('#drivers-schedule-table > tbody').append(
                    `
                                                <tr>
                                                    <td>${schedule_list[i].driver_sdid}</td>
                                                    <td>${schedule_list[i].driver.did}</td>
                                                    <td>${schedule_list[i].driver.name}</td>
                                                    <td>${schedule_list[i].start_date}</td>
                                                    <td>${schedule_list[i].end_date}</td>
                                                </tr>
                                                `
                );
            }
        }
    });
});

//-------------------------------------------------------------------------------------------------------------------

//--------------Home----------------
// sign in button click

$('.btn-schedule').css('display', 'none');
let driver_name = '';
let driver_id = '';
let address = '';
let contact = '';
let nic = '';
let dr_license = '';
let uid = '';
let schedule_list;
function loginBtnOnClick() {
    $('#btnSignIn').click(function () {
        //get email
        let email = $('#txtEmail').val();
        //get password
        let password = $('#password').val();

        $.ajax({
            url: 'http://localhost:8080/Easy_Car_Rental_Server/login',
            method: 'get',
            async: true,
            data: {
                email: email,
                password: password
            },
            dataType: 'json',
            success: function (response) {
                try {
                    if (response.data.role === 'driver') {
                        //get driver data
                        $.ajax({
                            url: 'http://localhost:8080/Easy_Car_Rental_Server/driver/get/' + response.data.uid,
                            method: 'get',
                            dataType: 'json',
                            success: function (response) {
                                //set user profile details
                                driver_name = response.data.name;
                                driver_id = response.data.did;

                                $('#txtDriverName').text(driver_name);

                                //clear email & password fields
                                $('#txtEmail').val('');
                                $('#password').val('');
                                $('.btn-schedule').css('display', 'block');


                                //get schedule
                                $.ajax({
                                    method: 'GET',
                                    async: true,
                                    url: 'http://localhost:8080/Easy_Car_Rental_Server/driver_schedule/get/'+driver_id,
                                    dataType: 'json',
                                    success: function (response) {
                                        schedule_list = response.data;
                                        $('#drivers-schedule-table > tbody').empty();
                                        for (let i = 0; i < schedule_list.length; i++) {
                                            $('#drivers-schedule-table > tbody').append(
                                                `
                                                <tr>
                                                    <td>${schedule_list[i].driver_sdid}</td>
                                                    <td>${schedule_list[i].driver.did}</td>
                                                    <td>${schedule_list[i].driver.name}</td>
                                                    <td>${schedule_list[i].start_date}</td>
                                                    <td>${schedule_list[i].end_date}</td>
                                                </tr>
                                                `
                                            );
                                        }
                                    }
                                });

                                //load profile view
                                $.ajax({
                                    method: 'GET',
                                    async: true,
                                    url: './views/profile.html',
                                    contentType: 'text/html',
                                    success: (data) => {

                                        uid = response.data.user.uid;
                                        address = response.data.address;
                                        contact = response.data.contact;
                                        nic = response.data.nic;
                                        dr_license = response.data.dr_license;

                                        $('#main-container').html(data);
                                        $('#txtUID').val(uid);
                                        $('#txtDID').val(driver_id);
                                        $('#txtDriver_Name').val(driver_name);
                                        $('#txtAddress').val(address);
                                        $('#txtContact').val(contact);
                                        $('#txtNIC').val(nic);
                                        $('#txtDRLicense').val(dr_license);
                                    }
                                });
                            }
                        });
                    }
                } catch (e) {
                    alert('User not found!');
                }
            }
        });
    });
}