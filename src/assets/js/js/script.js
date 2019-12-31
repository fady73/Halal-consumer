/*global $,owl,smoothScroll,AOS,alert,nextTab,prevTab,URL*/
$(document).ready(function () {
    "use strict";

    /* ---------------------------------------------
     Loader Screen
    --------------------------------------------- */
    $(window).load(function () {
        $("body").css('overflow-y', 'auto');
        $('#loading').fadeOut(1000);
    });

    $('[data-tool="tooltip"]').tooltip({
        trigger: 'hover',
        animate: true,
        delay: 50,
        container: 'body'
    });


    /* ---------------------------------------------
     Scrool To Top Button Function
    --------------------------------------------- */

    $(window).scroll(function () {
        if ($(this).scrollTop() > 500) {
            $(".toTop").css("right", "20px");
        } else {
            $(".toTop").css("right", "-60px");
        }
    });

    $(".toTop").click(function () {
        $("html,body").animate({
            scrollTop: 0
        }, 500);
        return false;
    });


    //customize the header
    $(window).scroll(function () {
        if ($(this).scrollTop() > 151) {
            $('.main-head').addClass('sticky');
        } else {
            $('.main-head').removeClass('sticky');
        }
    });

    $('[data-fancybox]').fancybox({
        buttons: [
            "slideShow",
            "fullScreen",
            "thumbs",
            "close"
        ],
        protect: true
    });


    $('.h-slider').owlCarousel({
        items: 1,
        smartSpeed: 450,
        autoplay: 5000,
        dots: false,
        loop: true,
        nav: false,
        mouseDrag: false,
        animateOut: 'fadeOut',
        animateIn: 'fadeIn'
    });

    $('.videos-slider').owlCarousel({
        center: true,
        items: 1.7,
        loop: true,
        dots: true,
        navText: ["<i class='fa fa-caret-left'></i>", "<i class='fa fa-caret-right'></i>"],
        nav: true,
        autoplay: 4000,
        autoplayHoverPause: true,
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 1
            },
            1000: {
                items: 1.7
            }
        }
    });

    $('.select2').select2();

    $('.select-nosearch').select2({
        minimumResultsForSearch: Infinity
    });

    $('#filterdate').datetimepicker();

    AOS.init({
        once: true
    });

    $('.open-sidebar').on('click', function () {
        $('.sidebar').toggleClass('opened');
        $('.overlay_gen').fadeIn();
        $('body').addClass('sided');
    });

    $('.open-search').on('click', function () {
        $('.h-seach').slideToggle();
    });

    $('.overlay_gen').on('click', function () {
        $('.sidebar').toggleClass('opened');
        $('.overlay_gen').fadeOut();
        $('body').removeClass('sided');
    });

    $('select').niceSelect();

    // $('#data-table-basic,#data-table-basic2').DataTable({
    //     searching: false,
    //     paging: true,
    //     info: false,
    //     responsive: true,
    //     "language": {
    //         "decimal": "",
    //         "emptyTable": "لا توجد بيانات",
    //         "info": "Showing _START_ to _END_ of _TOTAL_ entries",
    //         "infoEmpty": "Showing 0 to 0 of 0 entries",
    //         "infoFiltered": "(filtered from _MAX_ total entries)",
    //         "infoPostFix": "",
    //         "thousands": ",",
    //         "lengthMenu": "Show _MENU_ entries",
    //         "loadingRecords": "جاري التحميل...",
    //         "processing": "جاري...",
    //         "search": "بحث:",
    //         "zeroRecords": "لا توجد نتائج مطابقة",
    //         "paginate": {
    //             "first": "الاول",
    //             "last": "الاخير",
    //             "next": "التالي",
    //             "previous": "السابق"
    //         },
    //         "aria": {
    //             "sortAscending": ": activate to sort column ascending",
    //             "sortDescending": ": activate to sort column descending"
    //         }
    //     }
    // });
    // $('#data-table-basic1').DataTable({
    //     searching: false,
    //     paging: true,
    //     info: false,
    //     responsive: true,
    //     "language": {
    //         "decimal": "",
    //         "emptyTable": "لا توجد بيانات",
    //         "info": "Showing _START_ to _END_ of _TOTAL_ entries",
    //         "infoEmpty": "Showing 0 to 0 of 0 entries",
    //         "infoFiltered": "(filtered from _MAX_ total entries)",
    //         "infoPostFix": "",
    //         "thousands": ",",
    //         "lengthMenu": "Show _MENU_ entries",
    //         "loadingRecords": "جاري التحميل...",
    //         "processing": "جاري...",
    //         "search": "بحث:",
    //         "zeroRecords": "لا توجد نتائج مطابقة",
    //         "paginate": {
    //             "first": "الاول",
    //             "last": "الاخير",
    //             "next": "التالي",
    //             "previous": "السابق"
    //         },
    //         "aria": {
    //             "sortAscending": ": activate to sort column ascending",
    //             "sortDescending": ": activate to sort column descending"
    //         }
    //     }
    // });


    var loadFile = function (event) {
        var output = document.getElementById('output');
        output.src = URL.createObjectURL(event.target.files[0]);
    };



    // Register Steps
    $('a[data-toggle="tab"]').on('show.bs.tab', function (e) {
        var $target = $(e.target);
        if ($target.parent().hasClass('disabled')) {
            return false;
        }
    });

    $(".next-step").click(function (e) {
        var $active = $('.stepwizard .nav-tabs li.active');
        $active.next().removeClass('disabled');
        nextTab($active);
    });

    $(".prev-step").click(function (e) {
        var $active = $('.stepwizard .nav-tabs li.active');
        prevTab($active);
    });

    function nextTab(elem) {
        $(elem).next().find('a[data-toggle="tab"]').click();
    }

    function prevTab(elem) {
        $(elem).prev().find('a[data-toggle="tab"]').click();
    }


});