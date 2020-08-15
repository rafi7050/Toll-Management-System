/**
 *
 * You can write your JS code here, DO NOT touch the default style file
 * because it will make it harder for you to update.
 *
 */

"use strict";

let perform_error_html = function (data) {
    return `<div class="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>${data}</strong>
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>`
};
$(function () {
    $('html').on('click', '.box-group', function () {
        let this_val = $(this).val()
        if (this_val == 'True' || this_val == '1') {
            $(this).closest('.group-box').find('.inner_card:first').show()
            $(this).closest('.group-box').addClass('active')
        } else {
            $(this).closest('.group-box').find('.inner_card:first').hide()
            $(this).closest('.group-box').removeClass('active')
        }
    })
    $('html').on('click', '.box-group2', function () {
        let this_val = $(this).val()
        if (this_val == 'True' || this_val == '1') {
            $(this).closest('.group-box').find('.card_inside:first').show()
            $(this).closest('.group-box').find('.card_inside:last').hide()
            $(this).closest('.group-box').addClass('active')
        } else {
            $(this).closest('.group-box').find('.card_inside:first').hide()
            $(this).closest('.group-box').find('.card_inside:last').show()
            $(this).closest('.group-box').removeClass('active')
        }
    })


    // if (!window.sessionStorage.getItem('designation_list')) {
    //     set_all_designation()
    // }
    //
    // var designation_list = get_all_designation()
    // if (!designation_list.length) {
    //     set_all_designation()
    //     designation_list = get_all_designation()
    // }

})

let get_company_type_designation_list = function (company_type) {
    let designation_list = get_all_designation()
    return designation_list.filter(x => x.company_type == company_type)
}

let get_designation_check_list = function (company_type) {
    let company_type_list = {
        10: 'Government',
        49: 'Army',
        50: 'Navy',
        51: 'Airforce',
        52: 'Police'
    }
    let company_typoe_check_list_dom = $('<div class="company_type_designation col-12 row no-gutters border-bottom p-2" data-id="' + company_type + '"></div>')
    company_typoe_check_list_dom.append('<label class="col-2 p-2">' + company_type_list[company_type] + '</label>')
    let check_list_dom = $('<div class="col-10"></div>')
    let designations = get_company_type_designation_list(company_type)
    designations.forEach(function (item) {
        check_list_dom.append(`<label class="p-2">
            <input type="checkbox" name="designation" value="${item.id}">
            <span>${item.name}</span>
        </label>`)
    })
    company_typoe_check_list_dom.append(check_list_dom)
    return company_typoe_check_list_dom
}

let get_designation_multiple_select = function (company_type) {
    let company_type_list = {
        10: 'Government',
        49: 'Army',
        50: 'Navy',
        51: 'Airforce',
        52: 'Police'
    }
    let company_typoe_check_list_dom = $('<div class="company_type_designation col no-gutters border-bottom p-2 border-right" data-id="' + company_type + '"></div>')
    company_typoe_check_list_dom.append('<div><label class="p-2 fw-7 fz-14">' + company_type_list[company_type] + '</label></div>')
    let check_list_dom = $('<select class="multiple_select w-100" name="designation" multiple="multiple"></select>')
    let designations = get_company_type_designation_list(company_type)
    designations.forEach(function (item) {
        check_list_dom.append(`<option value="${item.id}">${item.name}</option>`)
    })
    company_typoe_check_list_dom.append(check_list_dom)
    return company_typoe_check_list_dom
}


// $('.selectmultiple').select2();

let editor_init = function (selector) {
    tinymce.init({
        mode: 'textareas',
        height: 200,
        editor_selector: selector,
        menubar: false,
        branding: false,
        plugins: [
            'advlist autolink lists link image charmap print preview anchor textcolor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table contextmenu paste code help'
        ],
        toolbar: 'insert | undo redo |  formatselect | bold italic backcolor  | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
        // content_css: [
        //     '//fonts.googleapis.com/css?family=Lato:300,300i,400,400i',
        //     '//www.tinymce.com/css/codepen.min.css']
        setup: function (editor) {
            editor.on('change', function () {
                editor.save();
            });
        }
    });
}

let editor_regenerate = function (selector) {
    tinymce.remove('.' + selector);
    editor_init(selector)
}

let sms_get = function (app_id, type = null) {
    let data = {
        application: app_id
    }
    if (type == 'search_customer') {
        data = {
            search_customer: app_id
        }
    } else if (type == 'lead') {
        data = {
            lead: app_id
        }
    }

    axios.get('/api/v1/sms/', {
        params: data
    })
        .then(function (response) {
            let total_data = response.data.results;

            $('.single_sms').not(':first').remove();
            if (total_data.length) {
                $('.no-data').hide();
                $.each(total_data, function (i, val) {
                    let sms_history_template = $('.single_sms:first').clone();
                    sms_history_template.show();
                    sms_history_template.find('.created_at').text(val.created_at);
                    sms_history_template.find('.name').text(val.created_by_name);
                    sms_history_template.find('.created_at_time').text(val.created_at_time);
                    sms_history_template.find('.message').text(val.message);
                    $('.smsdata').append(sms_history_template)
                });
                $('.single_sms:first').remove();
            } else {
                $('.no-data').show();
                $('.single_sms').hide()
            }
        })
        .catch(function (error) {
            console.log(error);
        })
};

let mail_get = function (app_id, type = null) {
    let data = {
        application: app_id
    }
    if (type == 'search_customer') {
        data = {
            search_customer: app_id
        }
    }
    axios.get('/api/v1/mail/', {
        params: data
    })
        .then(function (response) {
            let total_data = response.data.results;
            $('.single_email').not(':first').remove();
            if (total_data.length) {
                $('.no-data').hide();
                $.each(total_data, function (i, val) {
                    let sms_history_template = $('.single_email:first').clone();
                    sms_history_template.show();
                    sms_history_template.find('.mail_sender').text(val.created_by_name);
                    sms_history_template.find('.send_time').text(val.created_at);
                    sms_history_template.find('.mail_subject').text(val.subject);
                    sms_history_template.find('.mail_body').text(val.message);
                    $('.email_list').append(sms_history_template);
                });
                $('.single_email:first').remove();
            } else {
                $('.no-data').show();
                $('.single_email').hide()
            }
        })
        .catch(function (error) {
            console.log(error);
        })
};

let followup_get = function (app_id, search = false) {
    let parameter = null
    if (search) {
        parameter = {search: app_id}
    } else {
        parameter = {application: app_id}
    }
    axios.get('/api/v1/cfollowup/', {
        params: parameter
    })
        .then(function (response) {

            let total_data = response.data.results;
            $('.single_followup').not(':first').remove()
            if (total_data.length) {
                $('.no-data').hide();
                $('.all_data').show();
                $.each(total_data, function (i, val) {
                    let sms_history_template = $('.single_followup:first').clone();
                    sms_history_template.show();
                    sms_history_template.find('div').eq(0).text(val.created_at);
                    sms_history_template.find('div').eq(1).text(val.call_purpose_details);
                    sms_history_template.find('div').eq(2).text(val.current_status_details);
                    sms_history_template.find('div').eq(3).text(val.remark);
                    sms_history_template.find('div').eq(4).text(val.created_by_name);
                    $('.followupdata').append(sms_history_template)

                });
                $('.single_followup:first').remove();
            } else {
                $('.no-data').show();
                $('.all_data').hide();
                $('.single_followup').hide()
            }

        })
        .catch(function (error) {
            console.log(error);
        })
};

let get_lead_followup = function (lead_id) {
    let parameter = {lead: lead_id}

    axios.get('/api/v1/cfollowup/', {
        params: parameter
    })
        .then(function (response) {

            let total_data = response.data.results;
            $('.single_followup').not(':first').remove()
            if (total_data.length) {
                $('.no-data').hide();
                $('.all_data').show();
                $.each(total_data, function (i, val) {
                    let sms_history_template = $('.single_followup:first').clone();
                    sms_history_template.show();
                    sms_history_template.find('div').eq(0).text(val.created_at);
                    sms_history_template.find('div').eq(1).text(val.call_purpose_details);
                    sms_history_template.find('div').eq(2).text(val.current_status_details);
                    sms_history_template.find('div').eq(3).text(val.remark);
                    sms_history_template.find('div').eq(4).text(val.created_by_name);
                    $('.followupdata').append(sms_history_template)

                });
                $('.single_followup:first').remove();
            } else {
                $('.no-data').show();
                $('.all_data').hide();
                $('.single_followup').hide()
            }

        })
        .catch(function (error) {
            console.log(error);
        })
};


let applicationupdate_get = function (app_id) {
    axios.get('/api/v1/applicationupdatelog/', {
        params: {
            application: app_id
        }
    })
        .then(function (response) {
            let total_data = response.data.results;
            $('.single_updata').not(':first').remove()
            if (total_data.length) {
                $('.no-data').hide();
                $('.all_data').show();
                $.each(total_data, function (i, val) {
                    let sms_history_template = $('.single_updata:first').clone();
                    sms_history_template.show();
                    sms_history_template.find('.date').text(val.created_at);
                    sms_history_template.find('.status').text(val.status_name);
                    sms_history_template.find('.bank_status').text(val.bank_status_name);
                    sms_history_template.find('.status_value').text(val.status_value);
                    sms_history_template.find('.remarks').html(stringToHTML(val.remarks));
                    sms_history_template.find('.created_by').text(val.created_by_name);
                    $('.updateupdata').append(sms_history_template)

                });
                $('.single_updata:first').remove();
            } else {
                $('.no-data').show();
                $('.all_data').hide();
                $('.single_updata').hide()
            }

        })
        .catch(function (error) {
            console.log(error);
        })
};

let forward_get = function (app_id) {

    axios.get('/api/v1/cactivity/', {
        params: {
            application: app_id
        }
    })
        .then(function (response) {
            let logined_user = $('.logined_user').attr('id');
            console.log(logined_user)
            let total_data = response.data.results;
            $('.single_forward').not(':first').remove();
            if (total_data.length) {
                $('.no-data').hide();
                $('.all_data').show();
                $.each(total_data, function (i, val) {
                    let sms_history_template = $('.single_forward:first').clone();
                    sms_history_template.show();
                    sms_history_template.find('.date_time').text(val.created_at);
                    if (val.from_user_name) {
                        sms_history_template.find('.from_user').html(val.from_user_name.name);
                    }
                    if (val.to_user_name) {
                        sms_history_template.find('.to_user').html(val.to_user_name.name);
                    }
                    sms_history_template.find('.in_hand_time').text(val.in_hand_time);
                    sms_history_template.find('.remarks').text(val.message);
                    if (i == 0 && logined_user == val.assign_from && val.message != 'Reverted') {
                        sms_history_template.find('.revert-btn').attr({
                            'data-assign-from': val.assign_from,
                            'data-value': val.id
                        })

                    } else {
                        sms_history_template.find('.revert-btn').remove()
                    }
                    $('.forwarddata').append(sms_history_template)
                });
                $('.single_forward:first').remove();
            } else {
                $('.no-data').show();
                $('.all_data').hide();
                $('.single_forward').hide()
            }

        })
        .catch(function (error) {
            console.log(error);
        })
};

let get_search_forward = function (search_id) {

    axios.get('/api/v1/cactivity/', {
        params: {
            search: search_id
        }
    })
        .then(function (response) {
            let logined_user = $('.logined_user').attr('id');
            console.log(logined_user)
            let total_data = response.data.results;
            $('.single_forward').not(':first').remove();
            if (total_data.length) {
                $('.no-data').hide();
                $('.all_data').show();
                $.each(total_data, function (i, val) {
                    let sms_history_template = $('.single_forward:first').clone();
                    sms_history_template.show();
                    sms_history_template.find('.date_time').text(val.created_at);
                    if (val.from_user_name) {
                        sms_history_template.find('.from_user').html(val.from_user_name.name);
                    }
                    if (val.to_user_name) {
                        sms_history_template.find('.to_user').html(val.to_user_name.name);
                    }
                    sms_history_template.find('.in_hand_time').text(val.in_hand_time);
                    sms_history_template.find('.remarks').text(val.message);
                    if (i == 0 && logined_user == val.assign_from && val.message != 'Reverted') {
                        sms_history_template.find('.revert-btn').attr({
                            'data-assign-from': val.assign_from,
                            'data-value': val.id
                        })

                    } else {
                        sms_history_template.find('.revert-btn').remove()
                    }
                    $('.forwarddata').append(sms_history_template)
                });
                $('.single_forward:first').remove();
            } else {
                $('.no-data').show();
                $('.all_data').hide();
                $('.single_forward').hide()
            }

        })
        .catch(function (error) {
            console.log(error);
        })
};


let get_sales_schedule = function (forward_content, user_id) {
    axios.get('/api/v1/slot/?no_page=true&slot_for=3')
        .then(function (response) {
            let data = response.data
            if (data) {
                let template = $($('#forward_sales_schedule').html())
                data.forEach(function (item) {
                    template.find('#sales_schedule_options').append($('<button class="btn btn-primary rounded-0 col m-1 p-1" type="button"></button>').attr('data-slot-id', item.id).html(item.start_time + ' - ' + item.end_time))
                })
                forward_content.find('.forward_data_input_container').html(template)
            }
        }).catch(function (error) {
        console.log(error)
    })
}

let get_team_user = function (group = null) {
    if (group) {
        $('[name="filter_assign_memger"] option').not(':first').remove()
        axios.get('/api/v1/profile/', {
            params: {user__groups: group}
        }).then(function (response) {
            let data = response.data.results
            if (data) {
                data.forEach(function (item) {
                    $('[name="filter_assign_memger"]').append($('<option></option>').text(item.username).val(item.user))
                })
            }
        })
    } else {
        $('[name="filter_assign_memger"] option').not(':first').remove()
    }

}

let user_get = function (group = null, location = null) {
    let params;
    if (group) {
        params = {
            user__groups: group,
            location: location,
        }
    } else {
        params = {
            location: location,
        }
    }
    axios.get('/api/v1/profile/', {
        params: params
    })
        .then(function (response) {
            let total_data = response.data.results;
            $('.single_user').not(':first').remove();
            $('.single_user').find('.forwardarea').hide().removeClass('open').addClass('close')
            if (total_data.length) {
                $('.no-member').hide()
                if (total_data[0].is_sales) {
                    $('.single_user').hide()
                    $('.cro_date_container').remove()
                    if (!$('.sales_location_container').length) {
                        let sales_forward_location_date = $('#sales_forward_location_date').html()
                        $('.followup_title').before(sales_forward_location_date)
                        // google.maps.event.addDomListener(window, 'load', new google.maps.places.Autocomplete(document.getElementById('google_location')));
                        // var bangaloreBounds = new google.maps.LatLngBounds(
                        //     new google.maps.LatLng(23.782898, 90.394363),
                        //     new google.maps.LatLng(23.809591, 90.367447),
                        // );
                        // google.maps.event.addDomListener(window, 'load', new google.maps.places.Autocomplete(document.getElementById('google_location'),{types: ['geocode'],bounds: bangaloreBounds,strictBounds: true,}));
                        let autocomplete = new google.maps.places.Autocomplete(
                            /** @type {!HTMLInputElement} */ (
                                document.getElementById('google_location')), {
                                // types: ['address'],
                                componentRestrictions: {country: "bd"},
                            });
                        $('.schedule_date').datetimepicker({
                            minDate: 0,
                            timepicker: false,
                            format: 'Y-m-d'
                        });
                    }
                    let pickup_schedule_location = $('[name="pickup_schedule_location"]').val()
                    let pickup_schedule_date = $('[name="pickup_schedule_date"]').val()
                    let group_id = $('[name="selectFollowupTeam"]').val()
                    console.log(pickup_schedule_location, pickup_schedule_date, group_id)
                    if (pickup_schedule_date && pickup_schedule_location) {
                        sales_get(group_id, pickup_schedule_date, pickup_schedule_location)
                    }
                } else if (total_data[0].is_cro) {
                    $('.single_user').hide()
                    $('.sales_location_container').remove()
                    if (!$('.cro_date_container').length) {
                        let cro_forward_date = $('#cro_forward_date').html()
                        $('.followup_title').before(cro_forward_date)
                        $('.schedule_date').datetimepicker({
                            minDate: 0,
                            timepicker: false,
                            format: 'Y-m-d'
                        });
                    }
                } else {
                    $('.cro_date_container').remove()
                    $('.sales_location_container').remove()
                    $('.single_user').find('.schedule_area').remove()
                    $.each(total_data, function (i, val) {
                        let sms_history_template = $('.single_user:first').clone();
                        sms_history_template.show();
                        sms_history_template.find('.username').text(val.username);
                        if (val.availability) {
                            sms_history_template.find('.availability').html('<i class="fa fa-check text-info" aria-hidden="true"></i>');
                        } else {
                            sms_history_template.find('.availability').html('<i class="fa fa-times text-danger" aria-hidden="true"></i>');
                        }
                        sms_history_template.find('.customer_in_hand').text(val.file_in_hand);
                        sms_history_template.find('.member_type').text(val.member_type);
                        sms_history_template.find('.assign_to').val(val.user);
                        sms_history_template.find('.forward_btn').attr('data-value', val.username);
                        sms_history_template.find('.forward-btn').attr('data-sales', val.is_sales);
                        sms_history_template.find('.forward-btn').attr('data-user', val.user);
                        $('.user_list').append(sms_history_template)
                    });
                    $('.single_user:first').remove();
                }

            } else {
                $('.no-member').show()
                $('.single_user').hide()
                $('.sales_location_container').remove()
                $('.single_user').find('.schedule_area').remove()
            }

        })
        .catch(function (error) {
            console.log(error);
        })
};

let sales_get = function (group = null, pickup_schedule_date = null, pickup_schedule_location = null) {
    if (group && pickup_schedule_date && pickup_schedule_location) {
        let params = {
            user__groups: group,
            pickup_schedule_date: pickup_schedule_date,
            pickup_schedule_location: pickup_schedule_location
        }

        axios.get('/api/v1/profile/', {
            params: params
        })
            .then(function (response) {
                let total_data = response.data.results;
                $('.single_user').not(':first').remove();
                if (total_data.length) {
                    $('.no-member').hide()
                    if (total_data[0].is_sales) {
                        if (!$('.sales_location_container').length) {
                            let sales_forward_location_date = $('#sales_forward_location_date').html()
                            $('.followup_title').before(sales_forward_location_date)
                            // var autocomplete;
                            // autocomplete = new google.maps.places.Autocomplete(
                            //     /** @type {!HTMLInputElement} */ (
                            //         document.getElementById('autocomplete')), {
                            //         types: ['(cities)'],
                            //         componentRestrictions: {country: "us"}
                            //     });
                            // google.maps.event.addDomListener(window, 'load', new google.maps.places.Autocomplete(document.getElementById('google_location'),{
                            //     // types: ['geocode'],
                            //     types: ['(cities)'],
                            //     componentRestrictions: {country: "us"}
                            // }));
                            new google.maps.places.Autocomplete(
                                /** @type {!HTMLInputElement} */ (
                                    document.getElementById('google_location')), {
                                    // types: ['address'],
                                    componentRestrictions: {country: "bd"},
                                });
                            $('.schedule_date').datetimepicker({
                                minDate: 0,
                                timepicker: false,
                                format: 'Y-m-d'
                            });
                        }
                    } else {
                        $('.sales_location_container').remove()
                    }
                    $('.single_user').find('.schedule_area').remove()
                    $.each(total_data, function (i, val) {
                        let sms_history_template = $('.single_user:first').clone();
                        sms_history_template.show();
                        sms_history_template.find('.username').text(val.username);
                        if (val.availability) {
                            sms_history_template.find('.availability').html('<i class="fa fa-check text-info" aria-hidden="true"></i>');
                        } else {
                            sms_history_template.find('.availability').html('<i class="fa fa-times text-danger" aria-hidden="true"></i>');
                        }
                        sms_history_template.find('.customer_in_hand').text(val.file_in_hand);
                        sms_history_template.find('.member_type').text(val.member_type);
                        sms_history_template.find('.assign_to').val(val.user);
                        sms_history_template.find('.forward_btn').attr('data-value', val.username);
                        sms_history_template.find('.forward-btn').attr('data-sales', val.is_sales);
                        sms_history_template.find('.forward-btn').attr('data-user', val.user);
                        if (val.schedule) {
                            let schedule_area = $('<div class="col schedule_area">Schedule Area</div>')
                            schedule_area.html($('<select name="schedule_slot" class="form-control rounded-0"></select>'))
                            val.schedule.forEach(function (item) {
                                schedule_area.find('[name="schedule_slot"]').append($('<option></option>').val(item.id).text(item.start_time + ' - ' + item.end_time))
                            })

                            sms_history_template.find('.forward_data_input_container .row').prepend(schedule_area);
                        }


                        $('.user_list').append(sms_history_template)
                    });
                    $('.single_user:first').remove();
                } else {
                    $('.no-member').show()
                    $('.single_user').hide()
                }

            })
            .catch(function (error) {
                console.log(error);
            })
    }
};

let cro_get = function (group = null, pickup_schedule_date = null) {
    if (group && pickup_schedule_date) {
        let params = {
            user__groups: group,
            pickup_schedule_date: pickup_schedule_date
        }

        axios.get('/api/v1/profile/', {
            params: params
        })
            .then(function (response) {
                let total_data = response.data.results;
                $('.single_user').not(':first').remove();
                $('.single_user').find('.schedule_area').remove()
                if (total_data.length) {
                    $('.no-member').hide()
                    $.each(total_data, function (i, val) {
                        let sms_history_template = $('.single_user:first').clone();
                        sms_history_template.show();
                        sms_history_template.find('.username').text(val.username);
                        if (val.availability) {
                            sms_history_template.find('.availability').html('<i class="fa fa-check text-info" aria-hidden="true"></i>');
                        } else {
                            sms_history_template.find('.availability').html('<i class="fa fa-times text-danger" aria-hidden="true"></i>');
                        }
                        sms_history_template.find('.customer_in_hand').text(val.file_in_hand);
                        sms_history_template.find('.member_type').text(val.member_type);
                        sms_history_template.find('.assign_to').val(val.user);
                        sms_history_template.find('.forward_btn').attr('data-value', val.username);
                        sms_history_template.find('.forward-btn').attr('data-sales', val.is_sales);
                        sms_history_template.find('.forward-btn').attr('data-user', val.user);
                        if (val.schedule) {
                            let schedule_area = $('<div class="col schedule_area">Schedule Area</div>')
                            schedule_area.html($('<select name="schedule_slot" class="form-control rounded-0"></select>'))
                            val.schedule.forEach(function (item) {
                                schedule_area.find('[name="schedule_slot"]').append($('<option></option>').val(item.id).text(item.start_time + ' - ' + item.end_time))
                            })

                            sms_history_template.find('.forward_data_input_container .row').prepend(schedule_area);
                        }


                        $('.user_list').append(sms_history_template)
                    });
                    $('.single_user:first').remove();
                } else {
                    $('.no-member').show()
                    $('.single_user').hide()
                }

            })
            .catch(function (error) {
                console.log(error);
            })
    }
};


let team_get = function (institute) {
    axios.get('/api/v1/group/', {
        params: {
            institute: institute
        }
    })
        .then(function (response) {
            let total_data = response.data.results;
            let followupteam = $('[name="selectFollowupTeam"]')
            followupteam.html('')
            followupteam.append('<option value="" disabled selected>Select A Team</option>')
            $.each(total_data, function (i, val) {
                followupteam.append('<option value="' + val.id + '">' + val.name + '</option>')
            })
            let team_id = followupteam.val();
            let area = $('[name="area"]').val()
            if (team_id) {
                user_get(team_id, area);
            } else {
                $('.single_user').hide()
                $('.no-member').show()
            }

        })
        .catch(function (error) {
            console.log(error);
        })
};


let area_get = function (institute) {
    axios.get('/api/v1/institute_location/', {
        params: {
            institute: institute
        }
    })
        .then(function (response) {
            let total_data = response.data.results;
            let area = $('[name="area"]')
            area.html('')
            area.append('<option value="" disabled selected>Select An Area</option>')
            if (total_data.length) {
                let locations = total_data[0].location

                $.each(locations, function (i, val) {
                    area.append('<option value="' + val.id + '">' + val.name + '</option>')
                })
            }


        })
        .catch(function (error) {
            console.log(error);
        })
};
let app_document_get = function (application, is_staff = false) {
    $('.require-doc-list').html('')
    axios.get('/api/v1/appdocdetails/', {
        params: {
            application: application
        }
    })
        .then(function (response) {
            $(document).ready(function () {
                $('.venobox').venobox({
                    framewidth: '50%',
                    frameheight: '50%',
                });
            });
            let data = response.data;
            let template = function (item) {
                return `<li class="d-flex justify-content-between ${item.doc_source}">
                    <div class="position-relative align-items-start d-flex  ">
                        <span class="rq_ceck mt-1 ">
                            <input type="checkbox"
                                    
                                   name="rec_doc[]"
                                   ${item.is_ready ? `checked` : ``}
                                   value="${item.id}">
                            <label class="my_label"></label>
                        </span>
                        <span class="rq_txt text-left fz-16 text-6464 document_title">${item.title} <br/> <small class="fz-11">${item.created_by_with_team}</small></span>
                    </div>
                    <div class="d-flex align-items-center justify-content-between">
                        <a class="pr-2 appdocupdate" data-value="${item.id}" href="#" title="document edit">
                           <i class="far fa-edit text-warning"></i>
                        </a>
                     ${item.image ? `
                        <a class="pl-2 pr-2 appdocview  venobox"  href="${item.image}"  data-value="${item.id}" >
                           <i class="far fa-eye"></i>
                        </a>
                        <a class="pl-2 pr-2 appdocimagedelete text-danger" data-value="${item.id}" href="#" title="image delete">
                            <i class="fa fa-minus-circle"></i>
                        </a>
                        
                        ` : `
                        <form enctype="multipart/form-data" class="upload_image_form" data-value="${item.id}">
                        <label for="upload_${item.id}">
                              <span class="fa fa-upload image_upload_icon" aria-hidden="true"></span>
                              <input name="image" type="file" class="upload_image_doc" id="upload_${item.id}" style="display:none">
                        </label>
                        </form>
                        <a class="pl-2 pr-2 appdocdelete" data-value="${item.id}" href="#" title="document delete">
                           <i class="far fa-trash-alt text-danger"></i>
                        </a>
                        `}
                        
                    </div>
                </li>`
            }
            $('.rec_doc_list').each(function () {
                let _this = $(this)
                let doc_type = $(this).attr('data-val');
                let doc_item = data.filter(item => item.type == doc_type);
                doc_item.forEach(function (item, index) {
                    if (item.created_by_with_team == null) {
                        item.created_by_with_team = ''
                        item.doc_source = ''
                    } else {
                        item.created_by_with_team = '<i class="text-585858 text-lowercase">- ' + item.created_by_with_team + '</i>'
                        item.doc_source = 'bank_document'
                    }
                    let single_doc = $(template(item))
                    if (!is_staff && item.doc_source != 'bank_document') {
                        single_doc.find('.rq_ceck').remove()
                        single_doc.find('.appdocupdate').remove()
                        single_doc.find('.appdocimagedelete').remove()
                        single_doc.find('.appdocdelete').remove()
                        single_doc.find('.image_upload_icon').remove()
                    }
                    _this.find('.require-doc-list').append(single_doc)
                })

            })

        })
        .catch(function (error) {
            console.log(error);
        })
};
// $(document).find('.select ').select2();
// $(document).find('.has-select2-child select ').select2();
$(document).ready(function () {
    $('.bcbd-select2').select2();

    // $('body').on('change', function () {
    //     setTimeout(function () {
    //         $('.dynamic_select2').select2();
    //         $('.select ').select2();
    //         $('.has-select2-child select ').select2();
    //     }, 100);
    // });

    $(".sidebar-menu>li").each(function () {
        var navItem = $(this);
        if (navItem.hasClass('dropdown')) {
            navItem.find('.dropdown-menu>li').each(function () {
                if ($(this).find("a").attr("href") == location.pathname) {
                    navItem.addClass("active");
                    $(this).addClass('active');
                }
            })
        } else {
            if (navItem.find("a").attr("href") == location.pathname) {
                navItem.addClass("active");
            }
        }

    });
});

$('.form-radio').each(function () {
    $(this).find('label').append('<span class="checkmark"></span>');
});


function readURL(input) {

    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $(input).closest('.form-group').find('.image-preview').attr('src', e.target.result);

            $(input).closest('.form-group').find('.image-preview').hide();
            $(input).closest('.form-group').find('.image-preview').fadeIn(650);

        }

        reader.readAsDataURL(input.files[0]);
    }
}

$(function () {
    $('[type="file"]').each(function () {
        if ($(this).attr('accept') == 'image/*') {
            let image_link = $(this).closest('.form-group').find('a[href]').attr('href');
            $(this).closest('.form-group').append('<img class="image-preview" src="//assets.aamartaka.com/static/img/blank-image.png" />');
            if (image_link) {
                $(this).closest('.form-group').find('.image-preview').attr('src', image_link);
            }
            $(this).hide();
        }
    });
    $('.image-preview').on('click', function () {
        $(this).closest('.form-group').find('[type="file"]').click();
    });
    $('[type="file"]').on('change', function () {
        readURL(this);
    })
});

let set_datatable = function (fields, url) {
    // call by this two parametter
    // let fields = ['id', 'institute_name', 'year', 'month', 'interest_rate', 'type_name', 'priority', 'status']
    // let url = '/api/v1/deposit/double_triple/?format=datatables'
    let table_template = $('<table class="table table-striped table-bordered"></table>').attr('id', 'datatable');
    table_template.attr('data-ajax', url)
    table_template.html($('<thead></thead>'));
    let tr_template = $('<tr></tr>');
    for (let item in fields) {
        let name = fields[item].replace('_', ' ')
        tr_template.append($('<td></td>').html(name.toUpperCase()).attr('data-data', fields[item]));
    }
    tr_template.append($('<td>Action</td>'));
    table_template.find('thead').html(tr_template)
    $('.table-responsive').html(table_template);
}

// var url = $(location).attr('href'),
//     parts = url.split("/"),
//     last_part = parts[parts.length - 2];
// console.log(last_part);


//
// var sidebarLink = $('.sidebar-menu').children('.nav-link').attr('href');
//
// console.log(sidebarLink);


let numberWithCommas = function (x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

let number_or_zero = function (x) {
    if (!x || isNaN(x)) {
        x = 0
    }
    return x
}

let int_or_zero = function (x) {
    return parseInt(number_or_zero(x))
}

let numberWithoutCommas = function (x) {
    if (x) {
        return x.replace(/,/g, '');
    } else {
        return 0
    }
}

let integerWithoutCommas = function (x) {
    if (!x) {
        return ''
    }
    let parts = x.toString().split(".");
    let number = parts[0]
    if (number) {
        return number.replace(/,/g, '');
    } else {
        return ''
    }
}

let round = function (x) {
    return Math.floor(x)
}


// $(function () {
//    $('[type="number"]').on('keyup',function () {
//        let value = $(this).val();
//        let new_value = numberWithCommas(value)
//        console.log(new_value)
//        $(this).val(new_value)
//
//    })
// });

//Multi select

$(function () {
    // $('.ms').change(function () {
    //     console.log($(this).val());
    // }).multipleSelect({
    //     width: '100%'
    // });

// $('.bcbd-multiselect').multipleSelect();


    $('form').attr('autocomplete', 'off');


    $('html').on('input', '.number-with-dot', function () {
        let number = $(this).val();
        let input_float = parseFloat(number)
        let max_value = parseFloat($(this).attr('data-max'))
        let output_number = ''
        if (input_float || input_float == 0) {
            if (isNaN(number)) {
                output_number = input_float
            } else {
                output_number = number
                if (countDecimals(number) > 2) {
                    output_number = input_float.toFixed(2)
                }

            }
        }
        if (max_value) {
            if (output_number > max_value) {
                output_number = max_value
            }
        }
        $(this).val(output_number)
    });

    $('html').on('input', '.integer-with-commas', function () {
        let number = $(this).val();
        let input_string = numberWithoutCommas(number)
        let max_value = parseInt($(this).attr('data-max'))
        let input_int = parseInt(input_string)
        let output_number = ''
        if (input_int || input_int == 0) {
            if (max_value) {
                if (input_int > max_value) {
                    input_int = max_value
                }
            }
            output_number = numberWithCommas(input_int)
        }
        $(this).val(output_number)
    });

    $('html').on('input', '.integer-without-commas', function () {
        let number = $(this).val();
        let input_string = numberWithoutCommas(number)
        let max_value = parseInt($(this).attr('data-max'))
        let input_int = parseInt(number)
        let output_number = ''
        if (input_int || input_int == 0) {
            output_number = input_int
        }
        if (max_value) {
            if (output_number > max_value) {
                output_number = max_value
            }
        }
        $(this).val(output_number)
    });

    $('html').on('input', '.month_field', function () {
        let number = $(this).val();
        if (number > 11) {
            $(this).val(11)
        }
    })

    $('html').on('input', '.positive_number', function () {
        let number = $(this).val();
        if (number < 0) {
            $(this).val(0)
        }
    })

    $('html').on('input', '.max_validate', function () {
        let max_value = parseInt($(this).attr('data-max'))
        if (max_value) {
            let value = $(this).val()
            if (value > max_value) {
                $(this).val(max_value)
            }
        }
    })


});

// $('body').on('click', function () {
//        setTimeout(function () {
//          $('.ms').change(function() {
//            console.log($(this).val());
//        }).multipleSelect({
//            width: '100%'
//        });
//        }, 100);
//    });

let countDecimals = function (value) {
    if (value == Math.floor(value)) {
        return 0;
    } else {
        return value.toString().split(".")[1].length || 0;
    }

}
$(".expandable-row").niceScroll();


function objectifyForm(formArray) {
    var returnArray = {};
    for (var i = 0; i < formArray.length; i++) {
        returnArray[formArray[i]['name']] = formArray[i]['value'];
    }
    return returnArray;
}

function objectifyFormInputConcat(formArray) {
    var returnArray = {};
    for (var i = 0; i < formArray.length; i++) {
        if (returnArray[formArray[i]['name']]) {
            returnArray[formArray[i]['name']] = returnArray[formArray[i]['name']] + formArray[i]['value'];
        } else {
            returnArray[formArray[i]['name']] = formArray[i]['value'];
        }
    }
    return returnArray;
}

function objectifyFormWithRename(formArray) {
    var returnArray = {};
    for (var i = 0; i < formArray.length; i++) {
        let name = formArray[i]['name'].split("-")[0]
        returnArray[name] = formArray[i]['value'];
    }
    return returnArray;
}


function objectifyFormList(formArray) {//serialize data function
    var returnArray = {};
    var returnObject = []
    for (var i = 0; i < formArray.length; i++) {
        if (returnArray[formArray[i]['name']]) {
            returnObject.push(returnArray);
            returnArray = {}
            returnArray[formArray[i]['name']] = formArray[i]['value'];
        } else {
            returnArray[formArray[i]['name']] = formArray[i]['value'];
        }
    }
    returnObject.push(returnArray);
    return returnObject
}

function objectifyFormListByArgument(formArray, argumentArray = []) {//serialize data function
    var returnArray = {};
    var returnObject = []
    var arrayList = []
    var tempName = ''
    for (var i = 0; i < formArray.length; i++) {
        if (returnArray[formArray[i]['name']]) {

            returnObject.push(returnArray);
            returnArray = {}
            if (argumentArray.indexOf(formArray[i]['name']) > -1) {

                if (tempName != formArray[i]['name']) {
                    returnArray[tempName] = arrayList;
                    arrayList = []
                }

                arrayList.push(formArray[i]['value'])
                tempName = formArray[i]['name'];

            } else {

                if (tempName == argumentArray[argumentArray.length - 1]) {
                    returnArray[tempName] = arrayList;
                    tempName = formArray[i]['value'];
                    arrayList = []
                }
                //console.log(arrayList)
                returnArray[formArray[i]['name']] = formArray[i]['value'];
            }
            // returnArray[formArray[i]['name']] = formArray[i]['value'];
        } else {

            if (argumentArray.indexOf(formArray[i]['name']) > -1) {

                if (tempName != formArray[i]['name']) {
                    returnArray[tempName] = arrayList;
                    arrayList = []
                }

                arrayList.push(formArray[i]['value'])
                tempName = formArray[i]['name'];

            } else {

                if (tempName == argumentArray[argumentArray.length - 1]) {
                    returnArray[tempName] = arrayList;
                    tempName = formArray[i]['value'];
                    arrayList = []
                }
                //console.log(arrayList)
                returnArray[formArray[i]['name']] = formArray[i]['value'];
            }

        }

    }
    returnObject.push(returnArray);
    return returnObject
}

function objectifyFormArgument(formArray, argumentArray = []) {
    var returnArray = {};
    let tempName = ''
    let arrayList = []
    for (var i = 0; i < formArray.length; i++) {

        if (argumentArray.indexOf(formArray[i]['name']) > -1) {

            if (tempName != '' && tempName != formArray[i]['name']) {

                returnArray[tempName] = arrayList;
                arrayList = []
            } else {
                arrayList.push(formArray[i]['value'])
                tempName = formArray[i]['name'];
            }
        } else {

            if (tempName == argumentArray[argumentArray.length - 1]) {
                returnArray[tempName] = arrayList;
                tempName = formArray[i]['value'];
                arrayList = []
            }
            returnArray[formArray[i]['name']] = formArray[i]['value'];
        }
    }
    return returnArray;
}


function objectifyFormListWithAttributeRename(formArray) {//serialize data function
    var returnArray = {};
    var returnObject = []
    for (var i = 0; i < formArray.length; i++) {
        let name = formArray[i]['name'].split("-")[0]
        if (returnArray[name]) {
            returnObject.push(returnArray);
            returnArray = {}
            returnArray[name] = formArray[i]['value'];
        } else {
            returnArray[name] = formArray[i]['value'];
        }
    }
    returnObject.push(returnArray);
    return returnObject
}


function objectNumberWithoutCommas(obj) {
    if ($.isArray(obj) || $.isPlainObject(obj)) {
        $.map(obj, function (val, index) {
            if ($.isArray(val) || $.isPlainObject(val)) {
                $.map(val, function (item, idx) {
                    obj[index][idx] = numberWithoutCommas(item)
                })
            } else {
                obj[index] = numberWithoutCommas(val)
            }
        })
    }
    return obj
}


function objectifyFormWithAttributeRename(formArray) {//serialize data function
    var returnArray = {};
    for (var i = 0; i < formArray.length; i++) {
        returnArray[formArray[i]['name'].split("-")[0]] = formArray[i]['value'];
    }
    return returnArray;
}

let select2regenerate = function (selector) {
    $(selector).find('option').removeAttr('data-select2-id')
    $(selector).removeAttr('data-select2-id').removeClass('select2-hidden-accessible')
    // $(selector).closest('.form-group').find('.select2-container').remove()
    $(selector).closest('div').find('.select2-container').remove()
    $(selector).select2();
}

let capitalize = function (str) {
    if (str) {
        str = str.toString()
        str = str.toLowerCase().replace(/\b[a-z]/g, function (letter) {
            return letter.toUpperCase();
        });
    } else {
        str = ''
    }
    return str
}

let strToslug = function (str, symbol = '-') {
    let string = str.toLowerCase();
    return string.replace(/ /g, symbol)
}

// $(function () {
//     $('.datepicker').datepicker({
//         format: 'yyyy-dd-mm',
//         uiLibrary: 'bootstrap4'
//     })
// })
$('.datepicker').datetimepicker({
    timepicker: false,
    format: 'Y-m-d'
});
$('.timepicker').datetimepicker({
    datepicker: false,
    format: 'H:i'
});
$('.datetimepicker').datetimepicker({
    format: 'Y-m-d H:i'
});


// $(window).on('load',function(){
//     $(document).find('#reportrange').children('span').text('');
// });


let customer_select_ajax = function (selector) {
    console.log(selector)

    function formatRepo(repo) {
        if (repo.loading) {
            return repo.text;
        }
        return '<div class="border-bottom rounded-0 search-view p-2"> <div class="media"> <div class="media-body"> <h6 class="m-0">' + repo.first_name + ' ' + repo.last_name + '</h6> <p class="m-0">' + repo.username + '</p> </div> </div> </div>';
    }

    function formatRepoSelection(repo) {
        if (repo.first_name) {
            return repo.first_name + ' ' + repo.last_name;
        }
        return repo.text;
    }


    $(selector).select2({
        ajax: {
            url: '/api/v1/customer/',
            dataType: 'json',
            data: function (params) {
                var queryParameters = {
                    search: params.term
                }

                return queryParameters;
            },
            processResults: function (data) {
                let result_data = data.results;
                result_data.map(function (item) {
                    return item['id'] = item.user
                })
                return {
                    results: result_data
                }
            },

        },
        escapeMarkup: function (markup) {
            return markup;
        },
        minimumInputLength: 1,
        templateResult: formatRepo,
        templateSelection: formatRepoSelection,
        theme: 'adwitt'

    });
}
let bank_customer_select_ajax = function (selector) {
    console.log(selector)

    function formatRepo(repo) {
        if (repo.loading) {
            return repo.text;
        }
        return '<div class="border rounded search-view"> <div class="media"> <img src="' + repo.profile_image + '" class="mr-3" alt="..."> <div class="media-body"> <h6 class="m-0">' + repo.first_name + ' ' + repo.last_name + '</h6> <p class="m-0">' + repo.username + '</p> </div> </div> </div>';
    }

    function formatRepoSelection(repo) {
        if (repo.first_name) {
            return repo.first_name + ' ' + repo.last_name;
        }
        return repo.text;
    }


    $(selector).select2({
        ajax: {
            url: '/api/v1/customer/',
            dataType: 'json',
            data: function (params) {
                var queryParameters = {
                    search: params.term
                }

                return queryParameters;
            },
            processResults: function (data) {
                let result_data = data.results;
                result_data.map(function (item) {
                    return item['id'] = item.user
                })
                return {
                    results: result_data
                }
            },

        },
        escapeMarkup: function (markup) {
            return markup;
        },
        minimumInputLength: 1,
        templateResult: formatRepo,
        templateSelection: formatRepoSelection,
        theme: 'adwitt'

    });
}

let company_select_ajax = function (selector) {
    function formatRepo(repo) {
        if (repo.loading) {
            return repo.text;
        }
        return repo.name
        // return '<div class="border search-view"> <div class="media"> <div class="media-body"> <h6 class="m-0">' + repo.name + '</h6> </div> </div> </div>';
    }

    function formatRepoSelection(repo) {
        if (repo.name) {
            return repo.name;
        }
        return repo.text;
    }


    $(selector).select2({
        ajax: {
            url: '/api/v1/company/',
            dataType: 'json',
            data: function (params) {
                var queryParameters = {
                    search: params.term
                }

                return queryParameters;
            },
            processResults: function (data) {
                return {
                    results: data.results
                };
            },

        },
        escapeMarkup: function (markup) {
            return markup;
        },
        minimumInputLength: 1,
        templateResult: formatRepo,
        templateSelection: formatRepoSelection,
        theme: 'adwitt'


    });
}

let institute_select_ajax = function (selector) {
    function formatRepo(repo) {
        if (repo.loading) {
            return repo.text;
        }
        return repo.name
        // return '<div class="border search-view"> <div class="media"> <div class="media-body"> <h6 class="m-0">' + repo.name + '</h6> </div> </div> </div>';
    }

    function formatRepoSelection(repo) {
        if (repo.name) {
            return repo.name;
        }
        return repo.text;
    }


    $(selector).select2({
        ajax: {
            url: '/api/v1/institutes/',
            dataType: 'json',
            data: function (params) {
                var queryParameters = {
                    search: params.term
                }

                return queryParameters;
            },
            processResults: function (data) {
                return {
                    results: data.results
                };
            },

        },
        escapeMarkup: function (markup) {
            return markup;
        },
        minimumInputLength: 1,
        templateResult: formatRepo,
        templateSelection: formatRepoSelection,
        theme: 'adwitt'


    });
}


//Set bg

$(".set-bg").each(function () {
    var thesrc = $(this).attr('data-bg');
    $(this).css("background-image", "url(" + thesrc + ")");
    $(this).css("background-position", "center");
    $(this).css("background-size", "cover");
    $(this).css("background-repeat", "no-repeat");
    $(this).removeAttr('data-bg');

});

$(window).on('load', function () {

    try {
        var sidebar = $('.main-sidebar');
        var windowHeight = $(window).height();
        var willbeHeight = windowHeight / 5;
        var itemdistance = $('.main-sidebar .active').offset().top;
        if (itemdistance >= windowHeight) {
            sidebar.scrollTop(itemdistance)
        }
    } catch (err) {
        // console.log(err.message);
    }


    $('.application-navbar a').each(function () {
        if ($(this).attr("href") == location.pathname) {
            $(this).addClass('active');
        }
    })

})

//Join Objects
function extend(obj, src) {
    for (var key in src) {
        if (src.hasOwnProperty(key)) obj[key] = src[key];
    }
    return obj;
}

// Remove Name Value From SerializerArray
let serializeRemove = function (thisArray, thisName) {
    "use strict";
    return thisArray.filter(function (item) {
        return item.name != thisName;
    });
}

let form_valid = function (tab_id) {
    let isValid = true
    var currentTab = $(tab_id)

    var curInputs = currentTab.find("input[type='text'],input[type='number'],input[type='url'],input[type='radio'],input[type='checkbox'],select");
    $(".form-group").removeClass("has-error");
    $(".form-group").find(".help-block").hide();
    for (var i = 0; i < curInputs.length; i++) {
        if (!curInputs[i].validity.valid) {
            console.log(curInputs[i])
            isValid = false;
            // $(curInputs[i]).closest(".form-group,.input-group").addClass("has-error");
            // $(curInputs[i]).closest(".form-group").find(".help-block").show();
        }
    }
    if (isValid) {
        $(tab_id).removeClass('was-validated')
    } else {
        $(tab_id).addClass('was-validated')
    }
    return isValid;
};

let form_valid_container = function (currentTab) {
    let isValid = true
    // var currentTab = $(tab_id)

    var curInputs = currentTab.find("input[type='text'],input[type='number'],input[type='url'],input[type='radio'],input[type='checkbox'],select");
    $(".form-group").removeClass("has-error");
    $(".form-group").find(".help-block").hide();
    for (var i = 0; i < curInputs.length; i++) {
        if (!curInputs[i].validity.valid) {
            console.log(curInputs[i])
            isValid = false;
            // $(curInputs[i]).closest(".form-group,.input-group").addClass("has-error");
            // $(curInputs[i]).closest(".form-group").find(".help-block").show();
        }
    }
    if (isValid) {
        currentTab.closest('.tab-pane').removeClass('was-validated')
    } else {
        currentTab.closest('.tab-pane').addClass('was-validated')
    }
    return isValid;
};


$('#notification_btn').click(function (e) {
    e.preventDefault();
    axios.get('/api/v1/notifications/')
        .then(function (response) {
            let total_data = response.data.results;
            $('.single_notification').not(':first').remove()
            if (total_data.length) {
                $.each(total_data, function (i, val) {
                    let sms_history_template = $('.single_notification:first').clone();
                    sms_history_template.show();
                    // console.log(sms_history_template.attr('href', val.id))
                    sms_history_template.find('img').attr('src', val.created_by_img);
                    sms_history_template.find('.dropdown-item-desc p').text(val.message);
                    sms_history_template.find('.dropdown-item-desc .time').text(val.created_at);
                    $('.notification_all').append(sms_history_template)

                });
                $('.single_notification:first').remove();
            } else {
                $('.single_notification').hide()
            }

        })
        .catch(function (error) {
            console.log(error);
        })
})

let preloader_show = function (content) {
    let preloader = `
    <div id="Preloader">
      <div id="overlayer"></div>
      <span class="loader">
        <span class="loader-inner"></span>
      </span>
    </div>`
    content.append(preloader)

    //
    // $(".loader").delay(2000).fadeOut("slow");
    // $("#overlayer").delay(2000).fadeOut("slow");

}
let preloader_hide = function (content) {
    $(".loader").delay(500).fadeOut("slow");
    $("#overlayer").delay(500).fadeOut("slow");
    setTimeout(function () {
        content.find("#Preloader").remove();
    }, 1000);


}

let loader_show = function () {
    let loader = $("<div id='bcbd-loader'></div>");
    loader.append($("<div class='loader'></div>").append($("<div class='loader-inner ball-beat'><div></div><div></div><div></div></div>")))
    // $('#main_section').children('div').not('.section-header').hide()
    $('#main_section .section-header').after(loader)

}

let loader_hide = function () {
    $('body').find('#bcbd-loader').remove()
    $('#main_section').children('div').not('.modal').show()
}

function wordCount(val) {
    return val.length;
}

let set_multiple = function () {
    $('body').find('.multiple_select_container').each(function () {
        $(this).find('select.multiple_select').multipleSelect(
            {
                minimumCountSelected: 30
            }
        )
        $(this).find('select.multiple_select').hide()
        $(this).find('.ms-parent.multiple_select').attr('style', 'width:100%;')
        // $(this).find('div.multiple_select').eq(0).show();
        // $(this).find('div.multiple_select').slice(1).remove()
    })
}

let set_multiple2 = function () {
    $('body').find('.multiple_select_container').each(function () {
        $(this).find('select.multiple_select').multipleSelect('refresh')
        $(this).find('select.multiple_select').hide()
        $(this).find('.ms-parent.multiple_select').attr('style', 'width:100%;')
        // $(this).find('div.multiple_select').eq(0).show();
        // $(this).find('div.multiple_select').slice(1).remove()
    })
}


let regenerate_multipleselect = function (selector) {
    selector.multipleSelect('refresh')
}

let reset_multiple_select = function (selector) {
    // selector.find('.multiple_select').multipleSelect({width: '100%'})
    // selector.find('div.multiple_select').eq(0).show();
    $(selector).closest('div').find('div.multiple_select').remove()
    select2regenerate(selector)
}


let ApplicationListDom = function (props) {
    console.log(props)
    return `
     <div class="section-body">
        <div class="row">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-body mb-0  shadow-sm p-0 mb-5 bg-white rounded">
                        <div class="row d-flex align-items-stretch no-gutters">
                            <div class="col-md-3 d-flex   justify-content-center flex-column border-right p-3">
                                <div class="border-bottom mb-3">
                                    <div class="row">
                                        <div class="col">
                                            <p class="mb-0">
                                                <strong>
                                                    #<span class="text-warning">${props.code}</span>
                                                </strong>
                                            </p>
                                        </div>
                                        <div class="col">
                                            <p class="mb-0">
                                                <strong>
                                                    Status: <span class="text-template.status">${props.status_name}</span>
                                                </strong>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div class="media">
                                    <img src="template.user_image"
                                         class="mr-3 rounded-circle"
                                         style="height:50px;width: 50px;" alt="user image">
                                    <div class="media-body">
                                        <h6 class="mb-1">
                                            ${props.customer_name.first_name} ${props.customer_name.last_name}
                                        </h6>
                                        <p class="d-block mb-2">
                                            ${props.income.company_name}
                                        </p>
                                        <a href="tel:template.mobile" class="mb-0 d-block text-primary">
                                            <i class="fas fa-phone"></i> &nbsp;
                                            template.mobile
                                        </a>
                                        <a href="#" class="mb-0 d-block text-primary">
                                            <i class="fas fa-map-marker-alt"></i>&nbsp;
                                            template.location
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3 d-flex   justify-content-center flex-column border-right p-3">
                                <div class="pb-2  border-bottom">
                                    <p class="mb-0">
                                        <span class="text-dark font-weight-bold">Existing Loan:</span> template.loan
                                    </p>
                                    <p class="mb-0">
                                        <span class="text-dark font-weight-bold">Existing Credit Card:</span>
                                        template.card
                                    </p>
                                </div>
                                <div>
                                    <p class="mb-0">
                                        <span class="text-dark font-weight-bold">Salary Bank Ac:</span>
                                        ${props.income.bank_name}
                                    </p>
                                    <p class="mb-0">
                                        <span class="text-dark font-weight-bold">Salary:</span>
                                        template.income_amount
                                    </p>
                                </div>
                            </div>
                            <div class="col-md-6 p-1">
                                <div class="row no-gutters d-flex align-items-stretch">
                                    <div class="col-md-5 border-right p-1 d-flex align-items-start justify-content-center flex-column">
                                        <p class="mb-0">
                                            <span class="text-dark font-weight-bold">Applied Bank:</span>
                                            template.applied_bank
                                        </p>
                                        <p class="mb-0">
                                            <span class="text-dark font-weight-bold">Applied Date:</span>
                                            template.created_at
                                        </p>

                                        <p class="mb-0">
                                            <span class="text-dark font-weight-bold">Product Name: </span>
                                            <span class="text-info">template.product_name</span>
                                        </p>
                                    </div>
                                    <div class="col-md-4 border-right p-3 d-flex align-items-start justify-content-center flex-column">
                                        <p class="mb-0">
                                            <span class="text-dark font-weight-bold">Applied: </span>
                                            <span class="text-warning">template.application_count</span> Times
                                        </p>
                                        <p class="mb-0">
                                            <span class="text-dark font-weight-bold">Team:</span>
                                            template.followup_team
                                        </p>
                                        <p class="mb-0">
                                            <span class="text-dark font-weight-bold">User:</span>
                                            template.followup_user
                                        </p>
                                        <p class="mb-0">
                                            <span class="text-dark font-weight-bold">Status:</span>
                                            template.followup_status
                                        </p>
                                    </div>
                                    <div class="col-md-3 p-3 d-flex justify-content-center flex-column">
                                        <div class="row mb-2">
                                            <div class="col-6 text-center">
                                                <a href="/application/template.id/applied_info/"
                                                   class="forward_modal btn btn-icon btn-primary d-inline-flex rounded-circle circle-btn">
                                                    <i class="far fa-eye"></i>
                                                </a>
                                                <div>
                                                    <small>
                                                        View
                                                    </small>
                                                </div>
                                            </div>
                                            <div class="col-6 text-center">

                                                <a href="tel:template.mobile"
                                                   class="btn btn-icon btn-success rounded-circle d-inline-flex circle-btn">
                                                    <i class="fas fa-phone"></i>
                                                </a>
                                                <div>
                                                    <small>
                                                        Call
                                                    </small>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-6 text-center">
                                                <a href="/application/template.id/forward/"
                                                   data-type="forward_history"
                                                   class="forward_modal btn circle-btn  rounded-circle d-inline-flex btn-outline-primary">
                                                    <i class="fas fa-reply"></i>
                                                </a>
                                                <div>
                                                    <small>
                                                        Forward
                                                    </small>
                                                </div>
                                            </div>
                                            <div class="col-6 text-center">
                                                <a href="/application/template.id/file_update/"
                                                   data-type="update_history"
                                                   data-value="template.id"
                                                   class="forward_modal btn circle-btn  rounded-circle d-inline-flex btn-outline-primary">
                                                    <i class="fas fa-external-link-alt"></i>
                                                </a>
                                                <div>
                                                    <small>
                                                        Update
                                                    </small>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-6 text-center">
                                                <a href="/application/template.id/update/"
                                                   class="btn circle-btn  rounded-circle d-inline-flex btn-outline-primary">
                                                    <i class="fas fa-edit"></i>
                                                </a>
                                                <div>
                                                    <small>
                                                        Edit
                                                    </small>
                                                </div>
                                            </div>
                                            <div class="col-6 text-center">
                                                <a href="/application/template.search_customer_info/eligibility/"
                                                   class="btn circle-btn  rounded-circle d-inline-flex btn-outline-primary">
                                                    <i class="fas fa-check"></i>
                                                    {#                                                    <i class="fas fa-exchange-alt"></i>#}
                                                </a>
                                                <div>
                                                    <small>
                                                        Eligibility
                                                    </small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row no-gutters border-top">
                            <button href="/application/template.id/required_doc/"
                                    data-value="template.id"
                                    data-type="document"
                                    class="forward_modal col-md-3  rounded-0  border-right d-flex align-items-center justify-content-center pt-2 pb-2 btn btn-outline-info">
                                            <span>
                                                <i class="fas fa-file-alt"></i> &nbsp;
                                                Document: template.app_doc_count / template.prof_card_doc_count
                                            </span>
                            </button>
                            <button data-value="template.id"
                                    href="/application/template.id/sms_history/"
                                    data-type="sms_history"
                                    class="forward_modal col-md-3  rounded-0 border-right d-flex align-items-center justify-content-center pt-2 pb-2 btn btn-outline-info">
                                            <span>
                                                <i class="fas fa-envelope"></i> &nbsp;
                                                SMS
                                            </span>
                            </button>
                            <button data-value="template.id" data-email="template.email"
                                    href="/application/template.id/email_history/"
                                    data-type="mail_history"
                                    class="forward_modal col-md-3  rounded-0 border-right d-flex align-items-center justify-content-center pt-2 pb-2 btn btn-outline-info">
                                            <span>
                                                <i class="fas fa-paper-plane"></i>
                                                &nbsp;
                                                Email
                                            </span>
                            </button>
                            <button href="/application/template.id/follow_up/"
                                    data-type="followup_history"
                                    data-value="template.id"
                                    class="forward_modal col-md-3  rounded-0  d-flex align-items-center justify-content-center pt-2 pb-2 btn btn-outline-info">
                                            <span>
                                                <i class="fas fa-user"></i> &nbsp;
                                                Customer Follow up
                                            </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
`;
}


let set_commas = function () {
    $('.integer-with-commas').each(function () {
        let number = $(this).val();
        let input_string = numberWithoutCommas(number)
        let input_int = parseInt(input_string)
        let output_number = ''
        if (input_int || input_int == 0) {
            output_number = numberWithCommas(input_int)
        }
        $(this).val(output_number)
    })
}

let checked_checkbox = function (container) {
    console.log(isElement(container))
    console.log(container)
    let checkbox = $(container + '[type="checkbox"]:checked')
    // let checkbox = $('input:checkbox:checked'+container)
    let result = checkbox.map(function () {
        return this.value;
    }).get()
    return result
}

function isElement(element) {
    return element instanceof Element || element instanceof HTMLDocument;
}

// Array.prototype.distinct = function (prop) {
//     return this.reduce(function (arr, item) {
//         arr.push(item)
//         return arr
//     },[])
// }

Array.prototype.distinct = function (prop) {
    return Array.from(new Set(this.map(s => s[prop]))).map(year => {
        return this.find(x => x[prop] == year)
    })
}

Array.prototype.groupBy = function (prop) {
    return this.reduce(function (groups, item) {
        const val = item[prop]
        groups[val] = groups[val] || []
        groups[val].push(item)
        return groups
    }, {})
}

Array.prototype.multiGroupBy = function (prop) {
    return this.reduce(function (groups, item) {
        let val = null
        prop.forEach(function (single) {
            if (item[single].length) {
                if (val) {
                    val = val + '-' + item[single].join('')
                } else {
                    val = item[single].join('')
                }
            }

        })
        if (val) {
            groups[val] = groups[val] || []
            groups[val].push(item)
            return groups
        }
    }, {})
}

String.prototype.zfill = function (prop) {
    let str = ''
    if (this) {
        str = this.toString()
    }
    return str.padStart(prop, '0')
}

Number.prototype.zfill = function (prop) {
    let str = ''
    if (this) {
        str = this.toString()
    }
    return str.padStart(prop, '0')
}

let get_schedule_history = function (date) {
    axios.get('/client/slot/available/', {
        params: {
            date: date,
        }
    })
        .then(function (response) {
            let data = response.data.results
            $('#schedule_slot').html('')
            $.each(data, function (i, value) {
                $('#schedule_slot').append($('<option>').text(value.start_time + ' - ' + value.end_time).attr('value', value.id));
            });
        })
        .catch(function (error) {
            console.log(error);
        })
        .then(function () {
            // always executed
        });
}

function activaTab(tab) {
    tab = tab.replace(/#/g, '')
    $('.nav-tabs a[href="#' + tab + '"]').tab('show');
    $('#' + tab).addClass('show active');
}

function activaApplicationTab(tab) {
    tab = tab.replace(/#/g, '')
    $('#myTab .nav-item a[href="#' + tab + '"]').tab('show');
    $('#' + tab).addClass('show active');
}


const arrSum = arr => arr.reduce((a, b) => parseInt(a) + parseInt(b), 0)

// $('.custom-grid').isotope({
//   itemSelector: '.custom-grid-item',
//   masonry: {
//     columnWidth: 100
//   }
// });

$('.custom-grid').isotope({
    itemSelector: '.custom-grid-item', // use a separate class for itemSelector, other than .col-
    percentPosition: true,
    masonry: {
        columnWidth: 50
    }
});

function ord(str) {
    if (str) {
        return str.charCodeAt(0);
    }
}

function chr(code) {
    return String.fromCharCode(code)
}

function b64DecodeUnicode(str) {
    // Going backwards: from bytestream, to percent-encoding, to original string.
    return decodeURIComponent(atob(str).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}

let decode = function (key, string) {
    let _dec = ''
    let enc = b64DecodeUnicode(string)
    for (let i = 0; i < enc.length; i++) {
        let key_c = key[i % key.length]
        let dec_c = chr((256 + ord(enc[i]) - ord(key_c)) % 256)
        _dec += dec_c
    }
    return _dec
}

function encryptStringWithXORtoHex(input, key) {
    var c = '';
    while (key.length < input.length) {
        key += key;
    }
    for (var i = 0; i < input.length; i++) {
        var value1 = input[i].charCodeAt(0);
        var value2 = key[i].charCodeAt(0);

        var xorValue = value1 ^ value2;

        var xorValueAsHexString = xorValue.toString("16");

        if (xorValueAsHexString.length < 2) {
            xorValueAsHexString = "0" + xorValueAsHexString;
        }

        c += xorValueAsHexString;
    }
    return c;
}

let calculate_emi = function (interestRate, loan_amount, tenure) {
    let totalMonth = tenure
    let loanIntrarest = interestRate / 12 / 100 // one month interest
    let emi = (loan_amount * loanIntrarest * Math.pow(1 + loanIntrarest, totalMonth)) / (Math.pow(1 + loanIntrarest, totalMonth) - 1)

    return emi
}

let calculate_payable_amount = function (interestRate, loan_amount, tenure) {
    let totalMonth = tenure
    let loanIntrarest = interestRate / 12 / 100 // one month interest
    let emi = (loan_amount * loanIntrarest * Math.pow(1 + loanIntrarest, totalMonth)) / (Math.pow(1 + loanIntrarest, totalMonth) - 1)

    return (emi * totalMonth).toLocaleString('en-us', {maximumFractionDigits: 0})

}

function init_date_dorpdown(container) {
    let date_dropdowns = container.closest('.date-dropdowns');
    date_dropdowns.after(container)
    date_dropdowns.remove()
    container.dateDropdowns({
        displayFormat: "ymd",
        monthFormat: "short",
        submitFormat: "yyyy-mm-dd",
        minAge: 0,
        daySuffixes: false,
        required: true
    });
}

function datedropdownpicker(container) {
    let value = container.val()
    container.dateDropdowns('destroy');
    if (value) {
        container.dateDropdowns({
            defaultDate: value,
            displayFormat: "ymd",
            monthFormat: "short",
            submitFormat: "yyyy-mm-dd",
            minAge: 0,
            daySuffixes: false
        });
    } else {
        container.dateDropdowns({
            displayFormat: "ymd",
            monthFormat: "short",
            submitFormat: "yyyy-mm-dd",
            minAge: 0,
            daySuffixes: false
        });
    }
}

function current_date_validate(content) {
    let val = content.val()
    let next_date_allow = content.attr('next_date_allow')
    console.log(next_date_allow)
    if (val && next_date_allow == 'false') {
        let selected_date = new Date(val)
        let this_date = new Date()
        if (this_date < selected_date) {
            this_date = this_date.toISOString().split('T')[0]
            content.val(this_date)
            datedropdownpicker(content)
        }
    }
}

function nFormatter(num, digits = 2) {
    var si = [
        {value: 1, symbol: ""},
        {value: 1E3, symbol: "K"},
        {value: 1E6, symbol: "M"},
        {value: 1E9, symbol: "G"},
        {value: 1E12, symbol: "T"},
        {value: 1E15, symbol: "P"},
        {value: 1E18, symbol: "E"}
    ];
    var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var i;
    for (i = si.length - 1; i > 0; i--) {
        if (num >= si[i].value) {
            break;
        }
    }
    return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
}

let printc = function (value) {
    return console.log(value)
}

let arrayOfobjectEmpty = function (arr) {
    if (arr.length) {
        if (Object.entries(arr[0]).length) {
            return true
        } else {
            return false
        }
    } else {
        return false
    }
}

function sortNumber(a, b) {
    return a - b;
}


// var validNavigation = false;
//
// function endSession() {
//   // Browser or broswer tab is closed
//   // Do sth here ...
//   alert("bye");
// }
//
// function wireUpEvents() {
//   /*
//   * For a list of events that triggers onbeforeunload on IE
//   * check http://msdn.microsoft.com/en-us/library/ms536907(VS.85).aspx
//   */
//   window.onbeforeunload = function() {
//       console.log(validNavigation)
//       if (!validNavigation) {
//          endSession();
//       }
//   }
//
//   // Attach the event keypress to exclude the F5 refresh
//   $(document).bind('keypress', function(e) {
//     if (e.keyCode == 116){
//       validNavigation = true;
//     }
//   });
//
//   // Attach the event click for all links in the page
//   $("a").bind("click", function() {
//     validNavigation = true;
//   });
//
//   // Attach the event submit for all forms in the page
//   $("form").bind("submit", function() {
//     validNavigation = true;
//   });
//
//   // Attach the event click for all inputs in the page
//   $("input[type=submit]").bind("click", function() {
//     validNavigation = true;
//   });
//
// }
//
// // Wire up the events as soon as the DOM tree is ready
// $(document).ready(function() {
//   wireUpEvents();
// });
//
// window.addEventListener('beforeunload', function (e) {
//   // Cancel the event
//   e.preventDefault();
//   // Chrome requires returnValue to be set
//   e.returnValue = '';
// });

let location_division_list = {
    1: 'Dhaka',
    2: 'Chattogram',
    3: 'Khulna',
    4: 'Rajshahi',
    5: 'Sylhet',
    6: 'Barishal',
    7: 'Rangpur',
    8: 'Mymensingh',
}

let get_location_by_division = function (division_id = null) {
    let locations = [
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/1/",
            "id": 1,
            "name": "Dhaka North City Corporation",
            "division": 1,
            "division_name": "Dhaka"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/2/",
            "id": 2,
            "name": "Dhaka South City Corporation",
            "division": 1,
            "division_name": "Dhaka"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/3/",
            "id": 3,
            "name": "Gazipur City Corporation",
            "division": 1,
            "division_name": "Dhaka"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/4/",
            "id": 4,
            "name": "Narayanganj City Corporation",
            "division": 1,
            "division_name": "Dhaka"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/5/",
            "id": 5,
            "name": "Dohar",
            "division": 1,
            "division_name": "Dhaka"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/6/",
            "id": 6,
            "name": "Tejgaon Circle",
            "division": 1,
            "division_name": "Dhaka"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/7/",
            "id": 7,
            "name": "Savar",
            "division": 1,
            "division_name": "Dhaka"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/8/",
            "id": 8,
            "name": "Nawabganj",
            "division": 1,
            "division_name": "Dhaka"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/9/",
            "id": 9,
            "name": "Keraniganj",
            "division": 1,
            "division_name": "Dhaka"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/12/",
            "id": 12,
            "name": "Sreepur",
            "division": 1,
            "division_name": "Dhaka"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/13/",
            "id": 13,
            "name": "Kaliakair",
            "division": 1,
            "division_name": "Dhaka"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/14/",
            "id": 14,
            "name": "Kapasia",
            "division": 1,
            "division_name": "Dhaka"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/15/",
            "id": 15,
            "name": "Araihazar",
            "division": 1,
            "division_name": "Dhaka"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/16/",
            "id": 16,
            "name": "Rupganj",
            "division": 1,
            "division_name": "Dhaka"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/17/",
            "id": 17,
            "name": "Bandar",
            "division": 1,
            "division_name": "Dhaka"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/18/",
            "id": 18,
            "name": "Sonargaon",
            "division": 1,
            "division_name": "Dhaka"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/19/",
            "id": 19,
            "name": "Muksudpur",
            "division": 1,
            "division_name": "Dhaka"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/20/",
            "id": 20,
            "name": "Kotwalipara",
            "division": 1,
            "division_name": "Dhaka"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/21/",
            "id": 21,
            "name": "Tungipara",
            "division": 1,
            "division_name": "Dhaka"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/22/",
            "id": 22,
            "name": "Gopalganj Sadar",
            "division": 1,
            "division_name": "Dhaka"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/23/",
            "id": 23,
            "name": "Kasiani",
            "division": 1,
            "division_name": "Dhaka"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/24/",
            "id": 24,
            "name": "Kishoreganj-Sadar",
            "division": 1,
            "division_name": "Dhaka"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/25/",
            "id": 25,
            "name": "Mithamoin",
            "division": 1,
            "division_name": "Dhaka"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/26/",
            "id": 26,
            "name": "Tarail",
            "division": 1,
            "division_name": "Dhaka"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/27/",
            "id": 27,
            "name": "Pakundia",
            "division": 1,
            "division_name": "Dhaka"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/28/",
            "id": 28,
            "name": "Kuliarchar",
            "division": 1,
            "division_name": "Dhaka"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/29/",
            "id": 29,
            "name": "Katiadi",
            "division": 1,
            "division_name": "Dhaka"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/30/",
            "id": 30,
            "name": "Nikli",
            "division": 1,
            "division_name": "Dhaka"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/31/",
            "id": 31,
            "name": "Karimganj",
            "division": 1,
            "division_name": "Dhaka"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/32/",
            "id": 32,
            "name": "Austagram",
            "division": 1,
            "division_name": "Dhaka"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/33/",
            "id": 33,
            "name": "Bajitpur",
            "division": 1,
            "division_name": "Dhaka"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/34/",
            "id": 34,
            "name": "Bhairab",
            "division": 1,
            "division_name": "Dhaka"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/35/",
            "id": 35,
            "name": "Hossainpur",
            "division": 1,
            "division_name": "Dhaka"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/36/",
            "id": 36,
            "name": "Itna",
            "division": 1,
            "division_name": "Dhaka"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/37/",
            "id": 37,
            "name": "Kalkini",
            "division": 1,
            "division_name": "Dhaka"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/38/",
            "id": 38,
            "name": "Madaripur Sadar",
            "division": 1,
            "division_name": "Dhaka"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/39/",
            "id": 39,
            "name": "Rajoir",
            "division": 1,
            "division_name": "Dhaka"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/40/",
            "id": 40,
            "name": "Shibchar",
            "division": 1,
            "division_name": "Dhaka"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/41/",
            "id": 41,
            "name": "Manikganj Sadar",
            "division": 1,
            "division_name": "Dhaka"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/42/",
            "id": 42,
            "name": "Daulatpur",
            "division": 1,
            "division_name": "Dhaka"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/43/",
            "id": 43,
            "name": "Harirampur",
            "division": 1,
            "division_name": "Dhaka"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/44/",
            "id": 44,
            "name": "Saturia",
            "division": 1,
            "division_name": "Dhaka"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/45/",
            "id": 45,
            "name": "Shivalaya",
            "division": 1,
            "division_name": "Dhaka"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/46/",
            "id": 46,
            "name": "Singair",
            "division": 1,
            "division_name": "Dhaka"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/47/",
            "id": 47,
            "name": "Ghior",
            "division": 1,
            "division_name": "Dhaka"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/48/",
            "id": 48,
            "name": "Gazaria",
            "division": 1,
            "division_name": "Dhaka"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/49/",
            "id": 49,
            "name": "Lauhajong",
            "division": 1,
            "division_name": "Dhaka"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/50/",
            "id": 50,
            "name": "Munshiganj Sadar",
            "division": 1,
            "division_name": "Dhaka"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/51/",
            "id": 51,
            "name": "Sreenagar",
            "division": 1,
            "division_name": "Dhaka"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/52/",
            "id": 52,
            "name": "Tongibari",
            "division": 1,
            "division_name": "Dhaka"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/53/",
            "id": 53,
            "name": "Sirajdikhan",
            "division": 1,
            "division_name": "Dhaka"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/54/",
            "id": 54,
            "name": "Baliakandi",
            "division": 1,
            "division_name": "Dhaka"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/55/",
            "id": 55,
            "name": "Goalanda",
            "division": 1,
            "division_name": "Dhaka"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/56/",
            "id": 56,
            "name": "Pangsha",
            "division": 1,
            "division_name": "Dhaka"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/57/",
            "id": 57,
            "name": "Rajbari Sadar",
            "division": 1,
            "division_name": "Dhaka"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/58/",
            "id": 58,
            "name": "Kalukhali",
            "division": 1,
            "division_name": "Dhaka"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/59/",
            "id": 59,
            "name": "Bhedarganj",
            "division": 1,
            "division_name": "Dhaka"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/60/",
            "id": 60,
            "name": "Damuddya",
            "division": 1,
            "division_name": "Dhaka"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/61/",
            "id": 61,
            "name": "Goshairhat",
            "division": 1,
            "division_name": "Dhaka"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/62/",
            "id": 62,
            "name": "Naria",
            "division": 1,
            "division_name": "Dhaka"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/63/",
            "id": 63,
            "name": "Shariatpur Sadar",
            "division": 1,
            "division_name": "Dhaka"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/64/",
            "id": 64,
            "name": "Janjira",
            "division": 1,
            "division_name": "Dhaka"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/65/",
            "id": 65,
            "name": "Saltha",
            "division": 1,
            "division_name": "Dhaka"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/66/",
            "id": 66,
            "name": "Nagarkanda",
            "division": 1,
            "division_name": "Dhaka"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/67/",
            "id": 67,
            "name": "Alfadanga",
            "division": 1,
            "division_name": "Dhaka"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/68/",
            "id": 68,
            "name": "Bhanga",
            "division": 1,
            "division_name": "Dhaka"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/69/",
            "id": 69,
            "name": "Boalmari",
            "division": 1,
            "division_name": "Dhaka"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/70/",
            "id": 70,
            "name": "Charbhadrasan",
            "division": 1,
            "division_name": "Dhaka"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/71/",
            "id": 71,
            "name": "Faridpur Sadar",
            "division": 1,
            "division_name": "Dhaka"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/72/",
            "id": 72,
            "name": "Sadarpur",
            "division": 1,
            "division_name": "Dhaka"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/73/",
            "id": 73,
            "name": "Madhukhali",
            "division": 1,
            "division_name": "Dhaka"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/74/",
            "id": 74,
            "name": "Ghatail",
            "division": 1,
            "division_name": "Dhaka"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/75/",
            "id": 75,
            "name": "Shakhipur",
            "division": 1,
            "division_name": "Dhaka"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/76/",
            "id": 76,
            "name": "Mirzapur",
            "division": 1,
            "division_name": "Dhaka"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/77/",
            "id": 77,
            "name": "Tangail Sadar",
            "division": 1,
            "division_name": "Dhaka"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/78/",
            "id": 78,
            "name": "Madhupur",
            "division": 1,
            "division_name": "Dhaka"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/79/",
            "id": 79,
            "name": "Kalihati",
            "division": 1,
            "division_name": "Dhaka"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/80/",
            "id": 80,
            "name": "Gopalpur",
            "division": 1,
            "division_name": "Dhaka"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/81/",
            "id": 81,
            "name": "Nagarpur",
            "division": 1,
            "division_name": "Dhaka"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/82/",
            "id": 82,
            "name": "Bhuapur",
            "division": 1,
            "division_name": "Dhaka"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/83/",
            "id": 83,
            "name": "Basail",
            "division": 1,
            "division_name": "Dhaka"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/84/",
            "id": 84,
            "name": "Dhanbari",
            "division": 1,
            "division_name": "Dhaka"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/85/",
            "id": 85,
            "name": "Delduar",
            "division": 1,
            "division_name": "Dhaka"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/86/",
            "id": 86,
            "name": "Shibpur",
            "division": 1,
            "division_name": "Dhaka"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/87/",
            "id": 87,
            "name": "Palash",
            "division": 1,
            "division_name": "Dhaka"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/88/",
            "id": 88,
            "name": "Narshingdi Sadar",
            "division": 1,
            "division_name": "Dhaka"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/89/",
            "id": 89,
            "name": "Raipura",
            "division": 1,
            "division_name": "Dhaka"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/90/",
            "id": 90,
            "name": "Belabo",
            "division": 1,
            "division_name": "Dhaka"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/91/",
            "id": 91,
            "name": "Monohardi",
            "division": 1,
            "division_name": "Dhaka"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/92/",
            "id": 92,
            "name": "Chattogram City Corporation",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/93/",
            "id": 93,
            "name": "Cumilla City Corporation",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/94/",
            "id": 94,
            "name": "Sandwip",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/95/",
            "id": 95,
            "name": "Lohagara",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/96/",
            "id": 96,
            "name": "Satkania",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/97/",
            "id": 97,
            "name": "Patiya",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/98/",
            "id": 98,
            "name": "Chandanish",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/99/",
            "id": 99,
            "name": "Boalkhali",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/100/",
            "id": 100,
            "name": "Banskhali",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/101/",
            "id": 101,
            "name": "Sitakunda",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/102/",
            "id": 102,
            "name": "Raojan",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/103/",
            "id": 103,
            "name": "Rangunia",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/104/",
            "id": 104,
            "name": "Mirsharai",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/105/",
            "id": 105,
            "name": "Hathazari",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/106/",
            "id": 106,
            "name": "Fatikchari",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/107/",
            "id": 107,
            "name": "Anwara",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/108/",
            "id": 108,
            "name": "Karnaphuli",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/109/",
            "id": 109,
            "name": "Chandina",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/110/",
            "id": 110,
            "name": "Daudkandi",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/111/",
            "id": 111,
            "name": "Debidwar",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/112/",
            "id": 112,
            "name": "Barura",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/113/",
            "id": 113,
            "name": "Homna",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/114/",
            "id": 114,
            "name": "Monohorganj",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/115/",
            "id": 115,
            "name": "Brahmanpara",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/116/",
            "id": 116,
            "name": "Burichong",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/117/",
            "id": 117,
            "name": "Chouddagram",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/118/",
            "id": 118,
            "name": "Laksham",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/119/",
            "id": 119,
            "name": "Nangalkot",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/120/",
            "id": 120,
            "name": "Titas",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/121/",
            "id": 121,
            "name": "Cumilla-S Daksin",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/122/",
            "id": 122,
            "name": "Muradnagar",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/123/",
            "id": 123,
            "name": "Meghna",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/124/",
            "id": 124,
            "name": "Lalmai",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/125/",
            "id": 125,
            "name": "Bandarban Sadar",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/126/",
            "id": 126,
            "name": "Rowangchari",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/127/",
            "id": 127,
            "name": "Thanchi",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/128/",
            "id": 128,
            "name": "Lama",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/129/",
            "id": 129,
            "name": "Naikhyongchari",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/130/",
            "id": 130,
            "name": "Alikadam",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/131/",
            "id": 131,
            "name": "Ruma",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/132/",
            "id": 132,
            "name": "Ashuganj",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/133/",
            "id": 133,
            "name": "Nasirnagar",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/134/",
            "id": 134,
            "name": "Sarail",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/135/",
            "id": 135,
            "name": "Akhaura",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/136/",
            "id": 136,
            "name": "Bancharampur",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/137/",
            "id": 137,
            "name": "B.Baria Sadar",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/138/",
            "id": 138,
            "name": "Kasba",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/139/",
            "id": 139,
            "name": "Nabinagar",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/140/",
            "id": 140,
            "name": "BijoyNagar",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/141/",
            "id": 141,
            "name": "Shahrasti",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/142/",
            "id": 142,
            "name": "Chandpur Sadar",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/143/",
            "id": 143,
            "name": "Faridganj",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/144/",
            "id": 144,
            "name": "Haimchar",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/145/",
            "id": 145,
            "name": "Haziganj",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/146/",
            "id": 146,
            "name": "Matlab (Uttar)",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/147/",
            "id": 147,
            "name": "Matlab (Dakshin)",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/148/",
            "id": 148,
            "name": "Kachua",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/149/",
            "id": 149,
            "name": "Kutubdia",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/150/",
            "id": 150,
            "name": "Cox's Bazar Sadar",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/151/",
            "id": 151,
            "name": "Chakoria",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/152/",
            "id": 152,
            "name": "Pekua",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/153/",
            "id": 153,
            "name": "Moheskhali",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/154/",
            "id": 154,
            "name": "Ramu",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/155/",
            "id": 155,
            "name": "Ukhiya",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/156/",
            "id": 156,
            "name": "Teknaf",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/157/",
            "id": 157,
            "name": "Daganbhuiyan",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/158/",
            "id": 158,
            "name": "Chhagalniya",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/159/",
            "id": 159,
            "name": "Sonagazi",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/160/",
            "id": 160,
            "name": "Feni Sadar",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/161/",
            "id": 161,
            "name": "Porshuram",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/162/",
            "id": 162,
            "name": "Fulgazi",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/163/",
            "id": 163,
            "name": "Khagrachari Sadar",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/164/",
            "id": 164,
            "name": "Mahalchari",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/165/",
            "id": 165,
            "name": "Dighinala",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/166/",
            "id": 166,
            "name": "Panchari",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/167/",
            "id": 167,
            "name": "Ramgarh",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/168/",
            "id": 168,
            "name": "Manikchari",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/169/",
            "id": 169,
            "name": "Laxmichari",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/170/",
            "id": 170,
            "name": "Matiranga",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/171/",
            "id": 171,
            "name": "Guimara",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/172/",
            "id": 172,
            "name": "Komol Nagar",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/173/",
            "id": 173,
            "name": "Ramgati",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/174/",
            "id": 174,
            "name": "Ramganj",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/175/",
            "id": 175,
            "name": "Raipur",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/176/",
            "id": 176,
            "name": "Laxmipur Sadar",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/177/",
            "id": 177,
            "name": "Subarna Char",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/178/",
            "id": 178,
            "name": "Kabir Hat",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/179/",
            "id": 179,
            "name": "Sonaimuri",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/180/",
            "id": 180,
            "name": "Noakhali Sadar",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/181/",
            "id": 181,
            "name": "Chatkhil",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/182/",
            "id": 182,
            "name": "Begumganj",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/183/",
            "id": 183,
            "name": "Companiganj",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/184/",
            "id": 184,
            "name": "Hatiya",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/185/",
            "id": 185,
            "name": "Senbag",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/186/",
            "id": 186,
            "name": "Rajosthali",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/187/",
            "id": 187,
            "name": "Belaichari",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/188/",
            "id": 188,
            "name": "Rangamati Sadar",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/189/",
            "id": 189,
            "name": "Baghaichari",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/190/",
            "id": 190,
            "name": "Kaptai",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/191/",
            "id": 191,
            "name": "Nanniarchar",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/192/",
            "id": 192,
            "name": "Juraichari",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/193/",
            "id": 193,
            "name": "Langadu",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/194/",
            "id": 194,
            "name": "Barkal",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/195/",
            "id": 195,
            "name": "Kaukhali",
            "division": 2,
            "division_name": "Chattogram"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/196/",
            "id": 196,
            "name": "Khulna City Corporation",
            "division": 3,
            "division_name": "Khulna"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/197/",
            "id": 197,
            "name": "Dacope",
            "division": 3,
            "division_name": "Khulna"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/198/",
            "id": 198,
            "name": "Batiaghata",
            "division": 3,
            "division_name": "Khulna"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/199/",
            "id": 199,
            "name": "Dighalia",
            "division": 3,
            "division_name": "Khulna"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/200/",
            "id": 200,
            "name": "Dumuria",
            "division": 3,
            "division_name": "Khulna"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/201/",
            "id": 201,
            "name": "Koira",
            "division": 3,
            "division_name": "Khulna"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/202/",
            "id": 202,
            "name": "Paikgacha",
            "division": 3,
            "division_name": "Khulna"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/203/",
            "id": 203,
            "name": "Phultala",
            "division": 3,
            "division_name": "Khulna"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/204/",
            "id": 204,
            "name": "Terokhada",
            "division": 3,
            "division_name": "Khulna"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/205/",
            "id": 205,
            "name": "Rupsa",
            "division": 3,
            "division_name": "Khulna"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/206/",
            "id": 206,
            "name": "Mongla",
            "division": 3,
            "division_name": "Khulna"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/207/",
            "id": 207,
            "name": "Chitalmari",
            "division": 3,
            "division_name": "Khulna"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/208/",
            "id": 208,
            "name": "Sharankhola",
            "division": 3,
            "division_name": "Khulna"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/209/",
            "id": 209,
            "name": "Rampal",
            "division": 3,
            "division_name": "Khulna"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/210/",
            "id": 210,
            "name": "Mollahat",
            "division": 3,
            "division_name": "Khulna"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/211/",
            "id": 211,
            "name": "Kachua",
            "division": 3,
            "division_name": "Khulna"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/212/",
            "id": 212,
            "name": "Fakirhat",
            "division": 3,
            "division_name": "Khulna"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/213/",
            "id": 213,
            "name": "Bagerhat Sadar",
            "division": 3,
            "division_name": "Khulna"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/214/",
            "id": 214,
            "name": "Morrelganj",
            "division": 3,
            "division_name": "Khulna"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/215/",
            "id": 215,
            "name": "Damurhuda",
            "division": 3,
            "division_name": "Khulna"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/216/",
            "id": 216,
            "name": "Chuadanga Sadar",
            "division": 3,
            "division_name": "Khulna"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/217/",
            "id": 217,
            "name": "Jibannagar",
            "division": 3,
            "division_name": "Khulna"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/218/",
            "id": 218,
            "name": "Alamdanga",
            "division": 3,
            "division_name": "Khulna"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/219/",
            "id": 219,
            "name": "Abhoynagar",
            "division": 3,
            "division_name": "Khulna"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/220/",
            "id": 220,
            "name": "Bagherpara",
            "division": 3,
            "division_name": "Khulna"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/221/",
            "id": 221,
            "name": "Chowgacha",
            "division": 3,
            "division_name": "Khulna"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/222/",
            "id": 222,
            "name": "Jhikargacha",
            "division": 3,
            "division_name": "Khulna"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/223/",
            "id": 223,
            "name": "Keshabpur",
            "division": 3,
            "division_name": "Khulna"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/224/",
            "id": 224,
            "name": "Jashore Sadar",
            "division": 3,
            "division_name": "Khulna"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/225/",
            "id": 225,
            "name": "Monirampur",
            "division": 3,
            "division_name": "Khulna"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/226/",
            "id": 226,
            "name": "Sarsha",
            "division": 3,
            "division_name": "Khulna"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/227/",
            "id": 227,
            "name": "Shailkupa",
            "division": 3,
            "division_name": "Khulna"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/228/",
            "id": 228,
            "name": "Moheshpur",
            "division": 3,
            "division_name": "Khulna"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/229/",
            "id": 229,
            "name": "Kotchandpur",
            "division": 3,
            "division_name": "Khulna"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/230/",
            "id": 230,
            "name": "Harinakunda",
            "division": 3,
            "division_name": "Khulna"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/231/",
            "id": 231,
            "name": "Jhenaidah Sadar",
            "division": 3,
            "division_name": "Khulna"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/232/",
            "id": 232,
            "name": "Kaliganj",
            "division": 3,
            "division_name": "Khulna"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/233/",
            "id": 233,
            "name": "Khoksha",
            "division": 3,
            "division_name": "Khulna"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/234/",
            "id": 234,
            "name": "Bheramara",
            "division": 3,
            "division_name": "Khulna"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/235/",
            "id": 235,
            "name": "Daulatpur",
            "division": 3,
            "division_name": "Khulna"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/236/",
            "id": 236,
            "name": "Kumarkhali",
            "division": 3,
            "division_name": "Khulna"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/237/",
            "id": 237,
            "name": "Mirpur",
            "division": 3,
            "division_name": "Khulna"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/238/",
            "id": 238,
            "name": "Kushtia Sadar",
            "division": 3,
            "division_name": "Khulna"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/239/",
            "id": 239,
            "name": "Salikha",
            "division": 3,
            "division_name": "Khulna"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/240/",
            "id": 240,
            "name": "Magura Sadar",
            "division": 3,
            "division_name": "Khulna"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/241/",
            "id": 241,
            "name": "Mohammadpur",
            "division": 3,
            "division_name": "Khulna"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/242/",
            "id": 242,
            "name": "Sreepur",
            "division": 3,
            "division_name": "Khulna"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/243/",
            "id": 243,
            "name": "Narail Sadar",
            "division": 3,
            "division_name": "Khulna"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/244/",
            "id": 244,
            "name": "Lohagara",
            "division": 3,
            "division_name": "Khulna"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/245/",
            "id": 245,
            "name": "Kalia",
            "division": 3,
            "division_name": "Khulna"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/246/",
            "id": 246,
            "name": "Assasuni",
            "division": 3,
            "division_name": "Khulna"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/247/",
            "id": 247,
            "name": "Kalaroa",
            "division": 3,
            "division_name": "Khulna"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/248/",
            "id": 248,
            "name": "Satkhira Sadar",
            "division": 3,
            "division_name": "Khulna"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/249/",
            "id": 249,
            "name": "Kaliganj",
            "division": 3,
            "division_name": "Khulna"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/250/",
            "id": 250,
            "name": "Debhata",
            "division": 3,
            "division_name": "Khulna"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/251/",
            "id": 251,
            "name": "Shyamnagar",
            "division": 3,
            "division_name": "Khulna"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/252/",
            "id": 252,
            "name": "Tala",
            "division": 3,
            "division_name": "Khulna"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/253/",
            "id": 253,
            "name": "Rajshahi City Corporation",
            "division": 4,
            "division_name": "Rajshahi"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/254/",
            "id": 254,
            "name": "Godagari",
            "division": 4,
            "division_name": "Rajshahi"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/255/",
            "id": 255,
            "name": "Paba",
            "division": 4,
            "division_name": "Rajshahi"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/256/",
            "id": 256,
            "name": "Bagha",
            "division": 4,
            "division_name": "Rajshahi"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/257/",
            "id": 257,
            "name": "Bagmara",
            "division": 4,
            "division_name": "Rajshahi"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/258/",
            "id": 258,
            "name": "Charghat",
            "division": 4,
            "division_name": "Rajshahi"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/259/",
            "id": 259,
            "name": "Durgapur",
            "division": 4,
            "division_name": "Rajshahi"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/260/",
            "id": 260,
            "name": "Mohanpur",
            "division": 4,
            "division_name": "Rajshahi"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/261/",
            "id": 261,
            "name": "Puthia",
            "division": 4,
            "division_name": "Rajshahi"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/262/",
            "id": 262,
            "name": "Tanore",
            "division": 4,
            "division_name": "Rajshahi"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/263/",
            "id": 263,
            "name": "Joypurhat Sadar",
            "division": 4,
            "division_name": "Rajshahi"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/264/",
            "id": 264,
            "name": "Akkelpur",
            "division": 4,
            "division_name": "Rajshahi"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/265/",
            "id": 265,
            "name": "Khetlal",
            "division": 4,
            "division_name": "Rajshahi"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/266/",
            "id": 266,
            "name": "Panchbibi",
            "division": 4,
            "division_name": "Rajshahi"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/267/",
            "id": 267,
            "name": "Kalai",
            "division": 4,
            "division_name": "Rajshahi"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/268/",
            "id": 268,
            "name": "Adamdighi",
            "division": 4,
            "division_name": "Rajshahi"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/269/",
            "id": 269,
            "name": "Bogura Sadar",
            "division": 4,
            "division_name": "Rajshahi"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/270/",
            "id": 270,
            "name": "Dhunot",
            "division": 4,
            "division_name": "Rajshahi"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/271/",
            "id": 271,
            "name": "Dhupchancia",
            "division": 4,
            "division_name": "Rajshahi"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/272/",
            "id": 272,
            "name": "Gabtali",
            "division": 4,
            "division_name": "Rajshahi"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/273/",
            "id": 273,
            "name": "Kahaloo",
            "division": 4,
            "division_name": "Rajshahi"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/274/",
            "id": 274,
            "name": "Nandigram",
            "division": 4,
            "division_name": "Rajshahi"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/275/",
            "id": 275,
            "name": "Sariakandi",
            "division": 4,
            "division_name": "Rajshahi"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/276/",
            "id": 276,
            "name": "Sherpur",
            "division": 4,
            "division_name": "Rajshahi"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/277/",
            "id": 277,
            "name": "Shibganj",
            "division": 4,
            "division_name": "Rajshahi"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/278/",
            "id": 278,
            "name": "Sonatala",
            "division": 4,
            "division_name": "Rajshahi"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/279/",
            "id": 279,
            "name": "Shajahanpur",
            "division": 4,
            "division_name": "Rajshahi"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/280/",
            "id": 280,
            "name": "Mohadevpur",
            "division": 4,
            "division_name": "Rajshahi"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/281/",
            "id": 281,
            "name": "Shapahar",
            "division": 4,
            "division_name": "Rajshahi"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/282/",
            "id": 282,
            "name": "Raninagar",
            "division": 4,
            "division_name": "Rajshahi"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/283/",
            "id": 283,
            "name": "Porsha",
            "division": 4,
            "division_name": "Rajshahi"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/284/",
            "id": 284,
            "name": "Patnitala",
            "division": 4,
            "division_name": "Rajshahi"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/285/",
            "id": 285,
            "name": "Dhamoirhat",
            "division": 4,
            "division_name": "Rajshahi"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/286/",
            "id": 286,
            "name": "Naogaon Sadar",
            "division": 4,
            "division_name": "Rajshahi"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/287/",
            "id": 287,
            "name": "Niamatpur",
            "division": 4,
            "division_name": "Rajshahi"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/288/",
            "id": 288,
            "name": "Atrai",
            "division": 4,
            "division_name": "Rajshahi"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/289/",
            "id": 289,
            "name": "Manda",
            "division": 4,
            "division_name": "Rajshahi"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/290/",
            "id": 290,
            "name": "Badalgachi",
            "division": 4,
            "division_name": "Rajshahi"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/291/",
            "id": 291,
            "name": "Bagatipara",
            "division": 4,
            "division_name": "Rajshahi"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/292/",
            "id": 292,
            "name": "Baraigram",
            "division": 4,
            "division_name": "Rajshahi"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/293/",
            "id": 293,
            "name": "Gurudaspur",
            "division": 4,
            "division_name": "Rajshahi"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/294/",
            "id": 294,
            "name": "Lalpur",
            "division": 4,
            "division_name": "Rajshahi"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/295/",
            "id": 295,
            "name": "Natore Sadar",
            "division": 4,
            "division_name": "Rajshahi"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/296/",
            "id": 296,
            "name": "Singra",
            "division": 4,
            "division_name": "Rajshahi"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/297/",
            "id": 297,
            "name": "Naldanga",
            "division": 4,
            "division_name": "Rajshahi"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/298/",
            "id": 298,
            "name": "Gomostapur",
            "division": 4,
            "division_name": "Rajshahi"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/299/",
            "id": 299,
            "name": "Bholahat",
            "division": 4,
            "division_name": "Rajshahi"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/300/",
            "id": 300,
            "name": "Nachol",
            "division": 4,
            "division_name": "Rajshahi"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/301/",
            "id": 301,
            "name": "Nawabganj Sadar",
            "division": 4,
            "division_name": "Rajshahi"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/302/",
            "id": 302,
            "name": "Shibganj",
            "division": 4,
            "division_name": "Rajshahi"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/303/",
            "id": 303,
            "name": "Atghoria",
            "division": 4,
            "division_name": "Rajshahi"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/304/",
            "id": 304,
            "name": "Bera",
            "division": 4,
            "division_name": "Rajshahi"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/305/",
            "id": 305,
            "name": "Chatmohar",
            "division": 4,
            "division_name": "Rajshahi"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/306/",
            "id": 306,
            "name": "Faridpur",
            "division": 4,
            "division_name": "Rajshahi"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/307/",
            "id": 307,
            "name": "Ishwardi",
            "division": 4,
            "division_name": "Rajshahi"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/308/",
            "id": 308,
            "name": "Bhangura",
            "division": 4,
            "division_name": "Rajshahi"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/309/",
            "id": 309,
            "name": "Sujanagar",
            "division": 4,
            "division_name": "Rajshahi"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/310/",
            "id": 310,
            "name": "Santhia",
            "division": 4,
            "division_name": "Rajshahi"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/311/",
            "id": 311,
            "name": "Pabna Sadar",
            "division": 4,
            "division_name": "Rajshahi"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/312/",
            "id": 312,
            "name": "Tarash",
            "division": 4,
            "division_name": "Rajshahi"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/313/",
            "id": 313,
            "name": "Ullapara",
            "division": 4,
            "division_name": "Rajshahi"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/314/",
            "id": 314,
            "name": "Sirajganj Sadar",
            "division": 4,
            "division_name": "Rajshahi"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/315/",
            "id": 315,
            "name": "Shahzadpur",
            "division": 4,
            "division_name": "Rajshahi"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/316/",
            "id": 316,
            "name": "Raiganj",
            "division": 4,
            "division_name": "Rajshahi"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/317/",
            "id": 317,
            "name": "Kazipur",
            "division": 4,
            "division_name": "Rajshahi"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/318/",
            "id": 318,
            "name": "Chowhali",
            "division": 4,
            "division_name": "Rajshahi"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/319/",
            "id": 319,
            "name": "Belkuchi",
            "division": 4,
            "division_name": "Rajshahi"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/320/",
            "id": 320,
            "name": "Kamarkhand",
            "division": 4,
            "division_name": "Rajshahi"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/321/",
            "id": 321,
            "name": "Sylhet City Corporation",
            "division": 5,
            "division_name": "Sylhet"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/322/",
            "id": 322,
            "name": "Companiganj",
            "division": 5,
            "division_name": "Sylhet"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/323/",
            "id": 323,
            "name": "Kanaighat",
            "division": 5,
            "division_name": "Sylhet"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/324/",
            "id": 324,
            "name": "Dakshin Surma",
            "division": 5,
            "division_name": "Sylhet"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/325/",
            "id": 325,
            "name": "Zakiganj",
            "division": 5,
            "division_name": "Sylhet"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/326/",
            "id": 326,
            "name": "Jointiapur",
            "division": 5,
            "division_name": "Sylhet"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/327/",
            "id": 327,
            "name": "Gowainghat",
            "division": 5,
            "division_name": "Sylhet"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/328/",
            "id": 328,
            "name": "Fenchuganj",
            "division": 5,
            "division_name": "Sylhet"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/329/",
            "id": 329,
            "name": "Biswanath",
            "division": 5,
            "division_name": "Sylhet"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/330/",
            "id": 330,
            "name": "Beanibazar",
            "division": 5,
            "division_name": "Sylhet"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/331/",
            "id": 331,
            "name": "Balaganj",
            "division": 5,
            "division_name": "Sylhet"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/332/",
            "id": 332,
            "name": "Golapganj",
            "division": 5,
            "division_name": "Sylhet"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/333/",
            "id": 333,
            "name": "Osmaninagar",
            "division": 5,
            "division_name": "Sylhet"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/334/",
            "id": 334,
            "name": "Baniachong",
            "division": 5,
            "division_name": "Sylhet"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/335/",
            "id": 335,
            "name": "Azmiriganj",
            "division": 5,
            "division_name": "Sylhet"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/336/",
            "id": 336,
            "name": "Nabiganj",
            "division": 5,
            "division_name": "Sylhet"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/337/",
            "id": 337,
            "name": "Madhabpur",
            "division": 5,
            "division_name": "Sylhet"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/338/",
            "id": 338,
            "name": "Lakhai",
            "division": 5,
            "division_name": "Sylhet"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/339/",
            "id": 339,
            "name": "Habiganj Sadar",
            "division": 5,
            "division_name": "Sylhet"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/340/",
            "id": 340,
            "name": "Chunarughat",
            "division": 5,
            "division_name": "Sylhet"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/341/",
            "id": 341,
            "name": "Bahubal",
            "division": 5,
            "division_name": "Sylhet"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/342/",
            "id": 342,
            "name": "Sayestaganj",
            "division": 5,
            "division_name": "Sylhet"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/343/",
            "id": 343,
            "name": "Kulaura",
            "division": 5,
            "division_name": "Sylhet"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/344/",
            "id": 344,
            "name": "Kamalganj",
            "division": 5,
            "division_name": "Sylhet"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/345/",
            "id": 345,
            "name": "Moulvibazar Sadar",
            "division": 5,
            "division_name": "Sylhet"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/346/",
            "id": 346,
            "name": "Rajnagar",
            "division": 5,
            "division_name": "Sylhet"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/347/",
            "id": 347,
            "name": "Sreemangal",
            "division": 5,
            "division_name": "Sylhet"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/348/",
            "id": 348,
            "name": "Juri",
            "division": 5,
            "division_name": "Sylhet"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/349/",
            "id": 349,
            "name": "Barlekha",
            "division": 5,
            "division_name": "Sylhet"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/350/",
            "id": 350,
            "name": "Dakhin Sunamganj",
            "division": 5,
            "division_name": "Sylhet"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/351/",
            "id": 351,
            "name": "Biswamvarpur",
            "division": 5,
            "division_name": "Sylhet"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/352/",
            "id": 352,
            "name": "Tahirpur",
            "division": 5,
            "division_name": "Sylhet"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/353/",
            "id": 353,
            "name": "Sunamganj Sadar",
            "division": 5,
            "division_name": "Sylhet"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/354/",
            "id": 354,
            "name": "Sulla",
            "division": 5,
            "division_name": "Sylhet"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/355/",
            "id": 355,
            "name": "Jamalganj",
            "division": 5,
            "division_name": "Sylhet"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/356/",
            "id": 356,
            "name": "Jagannathpur",
            "division": 5,
            "division_name": "Sylhet"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/357/",
            "id": 357,
            "name": "Doarabazar",
            "division": 5,
            "division_name": "Sylhet"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/358/",
            "id": 358,
            "name": "Dharmapasha",
            "division": 5,
            "division_name": "Sylhet"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/359/",
            "id": 359,
            "name": "Chatak",
            "division": 5,
            "division_name": "Sylhet"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/360/",
            "id": 360,
            "name": "Derai",
            "division": 5,
            "division_name": "Sylhet"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/361/",
            "id": 361,
            "name": "Barishal City Corporation",
            "division": 6,
            "division_name": "Barishal"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/362/",
            "id": 362,
            "name": "Banaripara",
            "division": 6,
            "division_name": "Barishal"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/363/",
            "id": 363,
            "name": "Agailjhara",
            "division": 6,
            "division_name": "Barishal"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/364/",
            "id": 364,
            "name": "Gouranadi",
            "division": 6,
            "division_name": "Barishal"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/365/",
            "id": 365,
            "name": "Hizla",
            "division": 6,
            "division_name": "Barishal"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/366/",
            "id": 366,
            "name": "Mehendiganj",
            "division": 6,
            "division_name": "Barishal"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/367/",
            "id": 367,
            "name": "Muladi",
            "division": 6,
            "division_name": "Barishal"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/368/",
            "id": 368,
            "name": "Babuganj",
            "division": 6,
            "division_name": "Barishal"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/369/",
            "id": 369,
            "name": "Bakerganj",
            "division": 6,
            "division_name": "Barishal"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/370/",
            "id": 370,
            "name": "Uzirpur",
            "division": 6,
            "division_name": "Barishal"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/371/",
            "id": 371,
            "name": "Betagi",
            "division": 6,
            "division_name": "Barishal"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/372/",
            "id": 372,
            "name": "Amtali",
            "division": 6,
            "division_name": "Barishal"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/373/",
            "id": 373,
            "name": "Bamna",
            "division": 6,
            "division_name": "Barishal"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/374/",
            "id": 374,
            "name": "Barguna Sadar",
            "division": 6,
            "division_name": "Barishal"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/375/",
            "id": 375,
            "name": "Patharghata",
            "division": 6,
            "division_name": "Barishal"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/376/",
            "id": 376,
            "name": "Taltali",
            "division": 6,
            "division_name": "Barishal"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/377/",
            "id": 377,
            "name": "Bhola Sadar",
            "division": 6,
            "division_name": "Barishal"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/378/",
            "id": 378,
            "name": "Charfassion",
            "division": 6,
            "division_name": "Barishal"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/379/",
            "id": 379,
            "name": "Lalmohan",
            "division": 6,
            "division_name": "Barishal"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/380/",
            "id": 380,
            "name": "Monpura",
            "division": 6,
            "division_name": "Barishal"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/381/",
            "id": 381,
            "name": "Tazumuddin",
            "division": 6,
            "division_name": "Barishal"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/382/",
            "id": 382,
            "name": "Daulatkhan",
            "division": 6,
            "division_name": "Barishal"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/383/",
            "id": 383,
            "name": "Borhanuddin",
            "division": 6,
            "division_name": "Barishal"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/384/",
            "id": 384,
            "name": "Jhalokathi Sadar",
            "division": 6,
            "division_name": "Barishal"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/385/",
            "id": 385,
            "name": "Kathalia",
            "division": 6,
            "division_name": "Barishal"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/386/",
            "id": 386,
            "name": "Nalchity",
            "division": 6,
            "division_name": "Barishal"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/387/",
            "id": 387,
            "name": "Rajapur",
            "division": 6,
            "division_name": "Barishal"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/388/",
            "id": 388,
            "name": "Galachipa",
            "division": 6,
            "division_name": "Barishal"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/389/",
            "id": 389,
            "name": "Dashmina",
            "division": 6,
            "division_name": "Barishal"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/390/",
            "id": 390,
            "name": "Kalapara",
            "division": 6,
            "division_name": "Barishal"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/391/",
            "id": 391,
            "name": "Mirjaganj",
            "division": 6,
            "division_name": "Barishal"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/392/",
            "id": 392,
            "name": "Patuakhali Sadar",
            "division": 6,
            "division_name": "Barishal"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/393/",
            "id": 393,
            "name": "Dumki",
            "division": 6,
            "division_name": "Barishal"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/394/",
            "id": 394,
            "name": "Bauphal",
            "division": 6,
            "division_name": "Barishal"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/395/",
            "id": 395,
            "name": "Rangabali",
            "division": 6,
            "division_name": "Barishal"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/396/",
            "id": 396,
            "name": "Rangabali",
            "division": 6,
            "division_name": "Barishal"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/397/",
            "id": 397,
            "name": "Zianagar",
            "division": 6,
            "division_name": "Barishal"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/398/",
            "id": 398,
            "name": "Pirojpur sadar",
            "division": 6,
            "division_name": "Barishal"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/399/",
            "id": 399,
            "name": "Nazirpur",
            "division": 6,
            "division_name": "Barishal"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/400/",
            "id": 400,
            "name": "Nesarabad",
            "division": 6,
            "division_name": "Barishal"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/401/",
            "id": 401,
            "name": "Bhandaria",
            "division": 6,
            "division_name": "Barishal"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/402/",
            "id": 402,
            "name": "Kawkhali",
            "division": 6,
            "division_name": "Barishal"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/403/",
            "id": 403,
            "name": "Mothbaria",
            "division": 6,
            "division_name": "Barishal"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/404/",
            "id": 404,
            "name": "Rangpur City Corporation",
            "division": 7,
            "division_name": "Rangpur"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/405/",
            "id": 405,
            "name": "Pirgacha",
            "division": 7,
            "division_name": "Rangpur"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/406/",
            "id": 406,
            "name": "Pirganj",
            "division": 7,
            "division_name": "Rangpur"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/407/",
            "id": 407,
            "name": "Mithapukur",
            "division": 7,
            "division_name": "Rangpur"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/408/",
            "id": 408,
            "name": "Taraganj",
            "division": 7,
            "division_name": "Rangpur"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/409/",
            "id": 409,
            "name": "Kaunia",
            "division": 7,
            "division_name": "Rangpur"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/410/",
            "id": 410,
            "name": "Gangachara",
            "division": 7,
            "division_name": "Rangpur"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/411/",
            "id": 411,
            "name": "Badarganj",
            "division": 7,
            "division_name": "Rangpur"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/412/",
            "id": 412,
            "name": "Birol",
            "division": 7,
            "division_name": "Rangpur"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/413/",
            "id": 413,
            "name": "Bochaganj",
            "division": 7,
            "division_name": "Rangpur"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/414/",
            "id": 414,
            "name": "Chirirbandar",
            "division": 7,
            "division_name": "Rangpur"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/415/",
            "id": 415,
            "name": "Fulbari",
            "division": 7,
            "division_name": "Rangpur"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/416/",
            "id": 416,
            "name": "Ghoraghat",
            "division": 7,
            "division_name": "Rangpur"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/417/",
            "id": 417,
            "name": "Hakimpur",
            "division": 7,
            "division_name": "Rangpur"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/418/",
            "id": 418,
            "name": "Kaharol",
            "division": 7,
            "division_name": "Rangpur"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/419/",
            "id": 419,
            "name": "Khanshama",
            "division": 7,
            "division_name": "Rangpur"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/420/",
            "id": 420,
            "name": "Dinajpur Sadar",
            "division": 7,
            "division_name": "Rangpur"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/421/",
            "id": 421,
            "name": "Nawabganj",
            "division": 7,
            "division_name": "Rangpur"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/422/",
            "id": 422,
            "name": "Birampur",
            "division": 7,
            "division_name": "Rangpur"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/423/",
            "id": 423,
            "name": "Parbatipur",
            "division": 7,
            "division_name": "Rangpur"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/424/",
            "id": 424,
            "name": "Birganj",
            "division": 7,
            "division_name": "Rangpur"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/425/",
            "id": 425,
            "name": "Saghata",
            "division": 7,
            "division_name": "Rangpur"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/426/",
            "id": 426,
            "name": "Palashbari",
            "division": 7,
            "division_name": "Rangpur"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/427/",
            "id": 427,
            "name": "Sundarganj",
            "division": 7,
            "division_name": "Rangpur"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/428/",
            "id": 428,
            "name": "Sadullapur",
            "division": 7,
            "division_name": "Rangpur"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/429/",
            "id": 429,
            "name": "Gobindaganj",
            "division": 7,
            "division_name": "Rangpur"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/430/",
            "id": 430,
            "name": "Gaibandha Sadar",
            "division": 7,
            "division_name": "Rangpur"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/431/",
            "id": 431,
            "name": "Fulchari",
            "division": 7,
            "division_name": "Rangpur"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/432/",
            "id": 432,
            "name": "Bhurungamari",
            "division": 7,
            "division_name": "Rangpur"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/433/",
            "id": 433,
            "name": "Rajibpur",
            "division": 7,
            "division_name": "Rangpur"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/434/",
            "id": 434,
            "name": "Chilmari",
            "division": 7,
            "division_name": "Rangpur"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/435/",
            "id": 435,
            "name": "Fulbari",
            "division": 7,
            "division_name": "Rangpur"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/436/",
            "id": 436,
            "name": "Kurigram Sadar",
            "division": 7,
            "division_name": "Rangpur"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/437/",
            "id": 437,
            "name": "Nageswari",
            "division": 7,
            "division_name": "Rangpur"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/438/",
            "id": 438,
            "name": "Rowmari",
            "division": 7,
            "division_name": "Rangpur"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/439/",
            "id": 439,
            "name": "Rajarhat",
            "division": 7,
            "division_name": "Rangpur"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/440/",
            "id": 440,
            "name": "Ulipur",
            "division": 7,
            "division_name": "Rangpur"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/441/",
            "id": 441,
            "name": "Patgram",
            "division": 7,
            "division_name": "Rangpur"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/442/",
            "id": 442,
            "name": "Lalmonirhat Sadar",
            "division": 7,
            "division_name": "Rangpur"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/443/",
            "id": 443,
            "name": "Kaliganj",
            "division": 7,
            "division_name": "Rangpur"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/444/",
            "id": 444,
            "name": "Hatibandha",
            "division": 7,
            "division_name": "Rangpur"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/445/",
            "id": 445,
            "name": "Aditmari",
            "division": 7,
            "division_name": "Rangpur"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/446/",
            "id": 446,
            "name": "Dimla",
            "division": 7,
            "division_name": "Rangpur"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/447/",
            "id": 447,
            "name": "Domar",
            "division": 7,
            "division_name": "Rangpur"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/448/",
            "id": 448,
            "name": "Jaldhaka",
            "division": 7,
            "division_name": "Rangpur"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/449/",
            "id": 449,
            "name": "Kishoreganj",
            "division": 7,
            "division_name": "Rangpur"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/450/",
            "id": 450,
            "name": "Nilphamari Sadar",
            "division": 7,
            "division_name": "Rangpur"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/451/",
            "id": 451,
            "name": "Sayedpur",
            "division": 7,
            "division_name": "Rangpur"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/452/",
            "id": 452,
            "name": "Boda",
            "division": 7,
            "division_name": "Rangpur"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/453/",
            "id": 453,
            "name": "Atwari",
            "division": 7,
            "division_name": "Rangpur"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/454/",
            "id": 454,
            "name": "Debiganj",
            "division": 7,
            "division_name": "Rangpur"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/455/",
            "id": 455,
            "name": "Panchagarh Sadar",
            "division": 7,
            "division_name": "Rangpur"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/456/",
            "id": 456,
            "name": "Tetulia",
            "division": 7,
            "division_name": "Rangpur"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/457/",
            "id": 457,
            "name": "Thakurgaon Sadar",
            "division": 7,
            "division_name": "Rangpur"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/458/",
            "id": 458,
            "name": "Baliadangi",
            "division": 7,
            "division_name": "Rangpur"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/459/",
            "id": 459,
            "name": "Haripur",
            "division": 7,
            "division_name": "Rangpur"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/460/",
            "id": 460,
            "name": "Pirganj",
            "division": 7,
            "division_name": "Rangpur"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/461/",
            "id": 461,
            "name": "Ranisankail",
            "division": 7,
            "division_name": "Rangpur"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/462/",
            "id": 462,
            "name": "Mymensingh City Corporation",
            "division": 8,
            "division_name": "Mymensingh"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/463/",
            "id": 463,
            "name": "Nandail",
            "division": 8,
            "division_name": "Mymensingh"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/464/",
            "id": 464,
            "name": "Haluaghat",
            "division": 8,
            "division_name": "Mymensingh"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/465/",
            "id": 465,
            "name": "Muktagacha",
            "division": 8,
            "division_name": "Mymensingh"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/466/",
            "id": 466,
            "name": "Trishal",
            "division": 8,
            "division_name": "Mymensingh"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/467/",
            "id": 467,
            "name": "Dhobaura",
            "division": 8,
            "division_name": "Mymensingh"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/468/",
            "id": 468,
            "name": "Gaffargaon",
            "division": 8,
            "division_name": "Mymensingh"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/469/",
            "id": 469,
            "name": "Fulbaria",
            "division": 8,
            "division_name": "Mymensingh"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/470/",
            "id": 470,
            "name": "Ishwarganj",
            "division": 8,
            "division_name": "Mymensingh"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/471/",
            "id": 471,
            "name": "Phulpur",
            "division": 8,
            "division_name": "Mymensingh"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/472/",
            "id": 472,
            "name": "Gouripur",
            "division": 8,
            "division_name": "Mymensingh"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/473/",
            "id": 473,
            "name": "Bhaluka",
            "division": 8,
            "division_name": "Mymensingh"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/474/",
            "id": 474,
            "name": "Kendua",
            "division": 8,
            "division_name": "Mymensingh"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/475/",
            "id": 475,
            "name": "Atpara",
            "division": 8,
            "division_name": "Mymensingh"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/476/",
            "id": 476,
            "name": "Barhatta",
            "division": 8,
            "division_name": "Mymensingh"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/477/",
            "id": 477,
            "name": "Durgapur",
            "division": 8,
            "division_name": "Mymensingh"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/478/",
            "id": 478,
            "name": "Kalmakanda",
            "division": 8,
            "division_name": "Mymensingh"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/479/",
            "id": 479,
            "name": "Madan",
            "division": 8,
            "division_name": "Mymensingh"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/480/",
            "id": 480,
            "name": "Mohanganj",
            "division": 8,
            "division_name": "Mymensingh"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/481/",
            "id": 481,
            "name": "Netrakona Sadar",
            "division": 8,
            "division_name": "Mymensingh"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/482/",
            "id": 482,
            "name": "Purbadhala",
            "division": 8,
            "division_name": "Mymensingh"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/483/",
            "id": 483,
            "name": "Khaliajuri",
            "division": 8,
            "division_name": "Mymensingh"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/484/",
            "id": 484,
            "name": "Nakla",
            "division": 8,
            "division_name": "Mymensingh"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/485/",
            "id": 485,
            "name": "Jhenaigati",
            "division": 8,
            "division_name": "Mymensingh"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/486/",
            "id": 486,
            "name": "Nalitabari",
            "division": 8,
            "division_name": "Mymensingh"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/487/",
            "id": 487,
            "name": "Sherpur Sadar",
            "division": 8,
            "division_name": "Mymensingh"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/488/",
            "id": 488,
            "name": "Sreebordi",
            "division": 8,
            "division_name": "Mymensingh"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/489/",
            "id": 489,
            "name": "Dewanganj",
            "division": 8,
            "division_name": "Mymensingh"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/490/",
            "id": 490,
            "name": "Islampur",
            "division": 8,
            "division_name": "Mymensingh"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/491/",
            "id": 491,
            "name": "Jamalpur Sadar",
            "division": 8,
            "division_name": "Mymensingh"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/492/",
            "id": 492,
            "name": "Madarganj",
            "division": 8,
            "division_name": "Mymensingh"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/493/",
            "id": 493,
            "name": "Melendah",
            "division": 8,
            "division_name": "Mymensingh"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/494/",
            "id": 494,
            "name": "Sarishabari",
            "division": 8,
            "division_name": "Mymensingh"
        },
        {
            "url": "http://www.dev.local:8000/api/v1/upazila/495/",
            "id": 495,
            "name": "Bakshiganj",
            "division": 8,
            "division_name": "Mymensingh"
        }
    ]

    if (division_id) {
        locations = locations.filter(x => x.division == division_id)
    }

    return locations
}

let string_to_boolean = function (str = null) {
    let bool = false
    if (str && ['yes', 'true', 'True', 'Yes'].includes(str.toString().toLowerCase())) {
        bool = true
    }
    return bool
}

let datedropdownpicker_regenerate = function (container) {
    container.each(function () {
        init_date_dorpdown($(this))
        datedropdownpicker($(this))
    })
}

function date_validate() {
    $('[name="loan_starting_date"]').each(function () {
        if (!$(this).val()) {
            $(this).closest('.date-dropdowns').find('select.form-control').attr('style', 'border-color: #f10017 !important;')
        }
    })
}


function set_all_designation() {
    axios.get('/api/v1/designation')
        .then(function (response) {
            let designation_list = response.data
            window.sessionStorage.setItem('designation_list', JSON.stringify(designation_list))
        })
        .catch(function (error) {

        });

}

function get_all_designation() {
    let designation_list = window.sessionStorage.getItem('designation_list')
    return JSON.parse(designation_list)
}


var randomColor = function () {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

// $('.count').each(function () {
//     let counter = numberWithoutCommas(number_or_zero($(this).text()))
//     $(this).prop('Counter', 0).animate({
//         Counter: counter
//     }, {
//         duration: 4000,
//         easing: 'swing',
//         step: function (now) {
//             $(this).text(numberWithCommas(Math.ceil(now)));
//         }
//     });
// });

function count_zero_to_total(content) {
    let counter = numberWithoutCommas(content.text())
    content.prop('Counter', 0).animate({
        Counter: counter
    }, {
        duration: 1000,
        easing: 'swing',
        step: function (now) {
            content.text(numberWithCommas(Math.ceil(now)));
        }
    });
}

function institute_settings(setting_name = null) {
    let settings_institute_creditcard = sessionStorage.getItem('settings.institute.creditcard')
    if (setting_name && settings_institute_creditcard) {
        settings_institute_creditcard = JSON.parse(settings_institute_creditcard)
        return settings_institute_creditcard[setting_name]
    }
}

$('html').on('blur', '.phone_number', function () {
    let value = $(this).val()
    if (value) {
        let result_value = mobile_number_validate(value)
        if (!result_value) {
            $(this).addClass('text-danger error')
            $(this).val('')
        }
    }
})

$('html').on('input', '.phone_number', function (e) {
    let max_chars = 11
    let length = $(this).val().length
    let value = $(this).val()
    $(this).removeClass('text-danger error')
    if ($(this).val().length > max_chars) {
        $(this).val($(this).val().substr(0, max_chars)).change()
        let result_value = mobile_number_validate($(this).val().substr(0, max_chars))
        if (!result_value) {
            $(this).addClass('text-danger error')
        }
    } else if ($(this).val().length == max_chars) {
        let result_value = mobile_number_validate(value)
        if (!result_value) {
            $(this).addClass('text-danger error')
        }
    } else {
        $(this).addClass('text-danger error')
    }
});

function mobile_number_validate(val) {
    if (val) {
        val = val.trim()
        const regex = /\+?01[3456789][0-9]{8}\b/g
        let result = val.match(regex)
        if (result) {
            return result[0]
        }
    }
}

const getQueryParams = (params, url) => {

    let href = url;
    //this expression is to get the query strings
    let reg = new RegExp('[?&]' + params + '=([^&#]*)', 'i');
    let queryString = reg.exec(href);
    return queryString ? queryString[1] : null;
};

let scheduled_product = function () {
    $('#scheduled_product_modal').find('.modal-body').html('')
    axios.get('/api/v1/scheduled_product/').then(function (response) {
        console.log(response.data)
        let type = response.data.target_type
        if (type == 1) {
            if (response.data.target_type) {
                sessionStorage.setItem("code", response.data.target_details.code);
                let template = $($('#schedule_modal_application').html())
                template.find('.application_code').html(response.data.target_name)
                template.find('.name').text(response.data.name)
                template.find('.date').text(response.data.date)
                template.find('.slot_name').text(response.data.slot_name)
                $('#scheduled_product_modal').find('.modal-body').html(template)
                $('#scheduled_product_modal').find('#go_target').attr('data-type', response.data.target_type)
                $('#scheduled_product_modal').modal()
            }
        } else if (type == 3) {
            if (response.data.target_type) {
                sessionStorage.setItem("lead_id", response.data.target_id);
                let template = $($('#schedule_modal_lead').html())
                template.find('.name').text(response.data.name)
                template.find('.date').text(response.data.date)
                template.find('.slot_name').text(response.data.slot_name)
                $('#scheduled_product_modal').find('.modal-body').html(template)
                $('#scheduled_product_modal').find('#go_target').attr('data-type', response.data.target_type)
                $('#scheduled_product_modal').modal()
            }
        } else if (type == 4) {
            if (response.data.target_type) {
                sessionStorage.setItem("search_id", response.data.target_id);
                let template = $($('#schedule_modal_search').html())
                template.find('.name').text(response.data.name)
                template.find('.date').text(response.data.date)
                template.find('.slot_name').text(response.data.slot_name)
                $('#scheduled_product_modal').find('.modal-body').html(template)
                $('#scheduled_product_modal').find('#go_target').attr('data-type', response.data.target_type)
                $('#scheduled_product_modal').modal()
            }
        }

    }).catch(function (response) {
        console.log(response)
    })
}


let schecule_modal = function (response) {
    $('#scheduled_product_modal').find('.modal-body').html('')
    let type = response.data.target_type
    if (type == 1) {
        if (response.data.target_type) {
            sessionStorage.setItem("code", response.data.target_details.code);
            let template = $($('#schedule_modal_application').html())
            template.find('.application_code').html(response.data.target_name)
            template.find('.name').text(response.data.name)
            template.find('.date').text(response.data.date)
            template.find('.slot_name').text(response.data.slot_name)
            $('#scheduled_product_modal').find('.modal-body').html(template)
            $('#scheduled_product_modal').find('#go_target').attr('data-type', response.data.target_type)
            $('#scheduled_product_modal').modal()
        }
    } else if (type == 3) {
        if (response.data.target_type) {
            sessionStorage.setItem("lead_id", response.data.target_id);
            let template = $($('#schedule_modal_lead').html())
            template.find('.name').text(response.data.name)
            template.find('.date').text(response.data.date)
            template.find('.slot_name').text(response.data.slot_name)
            $('#scheduled_product_modal').find('.modal-body').html(template)
            $('#scheduled_product_modal').find('#go_target').attr('data-type', response.data.target_type)
            $('#scheduled_product_modal').modal()
        }
    } else if (type == 4) {
        if (response.data.target_type) {
            sessionStorage.setItem("search_id", response.data.target_id);
            let template = $($('#schedule_modal_search').html())
            template.find('.name').text(response.data.name)
            template.find('.date').text(response.data.date)
            template.find('.slot_name').text(response.data.slot_name)
            $('#scheduled_product_modal').find('.modal-body').html(template)
            $('#scheduled_product_modal').find('#go_target').attr('data-type', response.data.target_type)
            $('#scheduled_product_modal').modal()
        }
    }
}

$('html').on('click', '#go_target', function (e) {
    e.preventDefault()
    let type = $(this).attr('data-type')
    if (type == 1) {
        window.location = '/application/'
    } else if (type == 3) {
        window.location = '/lead/'
    } else if (type == 4) {
        window.location = '/accounts/customer/search_list/'
    }
})

function initAutocomplete() {
    // Create the autocomplete object, restricting the search predictions to
    // geographical location types.
    autocomplete = new google.maps.places.Autocomplete(
        document.getElementById('autocomplete'), {types: ['geocode']});

    // Avoid paying for data that you don't need by restricting the set of
    // place fields that are returned to just the address components.
    autocomplete.setFields(['address_component']);

    // When the user selects an address from the drop-down, populate the
    // address fields in the form.
    autocomplete.addListener('place_changed', fillInAddress);
}

let calcuslte_dbr = function (dps_initial_amount, dps_annual_interest_rate, dps_calculate_for_number) {
    //[(r/100 + 1)m/12 - 1 ] / [{(r/100+1)1/12-1}/(r/100+1)1/12]
    // let dps_initial_amount = $('[name="dps_initial_amount"]').val()
    // let dps_annual_interest_rate = $('[name="dps_annual_interest_rate"]').val()
    // let dps_calculate_for_number = $('[name="dps_calculate_for_number"]').val()
    dps_annual_interest_rate = dps_annual_interest_rate / 100
    dps_calculate_for_number = dps_calculate_for_number / 12
    var total_dps_annual_interest_rate = 0;
    var temp1 = 1 / 12;
    var month_number = dps_calculate_for_number;

    var temp2 = dps_annual_interest_rate + 1;
    var temp3 = Math.pow(temp2, month_number);
    /*[(r/100 + 1)m/12 */
    var temp4 = Math.pow(temp2, temp1);
    var temp5 = temp4 - 1;
    /*{(r/100+1)1/12-1}*/
    var temp6 = temp3 - 1;
    /*(r/100 + 1)m/12 - 1 */
    var temp7 = temp5 / temp4;
    /*{(r/100+1)1/12-1}/(r/100+1)1/12*/
    var temp8 = temp6 / temp7;
    /*[(r/100 + 1)m/12 - 1 ] / [{(r/100+1)1/12-1}/(r/100+1)1/12]*/
    console.log(temp8)
    var amount_at_maturity = dps_initial_amount * temp8;
    // console.log(amount_at_maturity)
    // var interest_earned = amount_at_maturity - (dps_initial_amount * month_number);
    return amount_at_maturity

}

let caldbr = function (im, r, m) {
    return ia * [Math.pow((r / 100 + 1), m / 12) - 1] / [(Math.pow((r / 100 + 1), 1 / 12) - 1) / Math.pow((r / 100 + 1), 1 / 12)]
}

var stringToHTML = function (str) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(str, 'text/html');
    return doc.body;
};

const count = names =>
    names.reduce((a, b) =>
        Object.assign(a, {[b]: (a[b] || 0) + 1}), {})


const duplicates = dict =>
    Object.keys(dict).filter((a) => dict[a] > 1)

const uniques = dict =>
    Object.keys(dict).filter((a) => dict[a] == 1)


$(function () {
    editor_init('tinymce_editor')
});

function order_form_submit() {
            let url = '/api/clients/v1/order/'
            var sample_order = {
                "total_amount": "342",
                "mobile_number": "3534543",
                "address_line_1": "34535",
                "address_line_2": "435",
                "place": "Aamartaka.com, Dhaka, Bangladesh",
                "latitude": "23.7847301",
                "longitude": "90.4008518",
                "zip": "3434",
                "zone": "3",
                "order_details": [
                    {"package": "1", "price": "180.5", "quantity": "1", "total_price": "180.5"},
                    {"product": "1", "price": "180.5", "quantity": "1", "total_price": "180.5"},
                    {"product": "2", "price": "90", "quantity": "2", "total_price": "90"},
                    {
                        "package": "2",
                        "price": "80.75",
                        "quantity": "2",
                        "total_price": "161.5"
                    }
                ]
            }
            axios.post(url, sample_order, {
                headers: {"X-CSRFToken": "{{ csrf_token }}","Authorization":"Token 2894d9da62990747a615468c4aee05b685e5abc2"},
            }).then(function (response) {

            })
        }