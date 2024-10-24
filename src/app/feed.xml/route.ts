import { formatISO } from "date-fns";
import ejs from "ejs";
import RSS from "rss";
import DATA from "../../data/data.json";

function getHTMLTemplate(data: {
  bvid: string;
  title: string;
  desc: string;
  hn_items: {
    times: { minutes: number; seconds: number }[];
    introduces: string[];
    links: (string | string[])[];
  };
}) {
  const parseData = {
    ...data,
    hn_items: {
      ...data.hn_items,
      times: data.hn_items.times.map((time) => ({
        format: `${`${time.minutes}`.padStart(
          2,
          "0",
        )}:${`${time.seconds}`.padStart(2, "0")}`,
        t: time.minutes * 60 + time.seconds,
      })),
      links: data.hn_items.links.map((link) =>
        Array.isArray(link) ? link : [link],
      ),
    },
  };

  const template = `<div>
  <h3>
    <a href="https://www.bilibili.com/video/<%= data.bvid %>" id="<%= data.bvid %>">
      <%= data.title %>
    </a>
  </h3>
  <p>
    <%= data.desc %>
  </p>
  <br />
  <table class="table table-hover text-center align-middle">
    <thead>
      <tr>
        <th class="col-1" scope="col">时间轴</th>
        <th class="col-2" scope="col">简介</th>
        <th class="col-2" scope="col">链接</th>
      </tr>
    </thead>
    <tbody>
      <% data.hn_items.times.forEach((time, index) => { %>
        <tr>
          <td>
            <a href="https://www.bilibili.com/video/<%= data.bvid %>?t=<%= time.t %>">
              <%= time.format %>
            </a>
          </td>
          <td><%= data.hn_items.introduces[index] %></td>
          <td>
            <% data.hn_items.links[index]?.map((link) => { %>
              <a href="<%= link %>"><%= link %></a>
            <% }); %>
          </td>
        </tr>
      <% }); %>
    </tbody>
  </table>
  <br />
</div>`;

  return ejs.render(template, { data: parseData });
}

export async function GET() {
  const rss = new RSS({
    title: "koala聊开源",
    description: "koala聊开源 rss 订阅源",
    site_url:
      "https://space.bilibili.com/489667127/channel/collectiondetail?sid=249279",
    feed_url: "https//koala-hacker-news.aiwan.run/feed.xml",
    language: "zh-CN",
    generator: "PHP 9.0",
    // custom_elements: [
    //   {
    //     follow_challenge: [
    //       {
    //         feedId: "67028040212142080",
    //       },
    //       {
    //         userId: "55825808031657984",
    //       },
    //     ],
    //   },
    // ],
  });

  DATA.forEach((item) => {
    rss.item({
      title: item.title,
      description: item.desc,
      url: `https://www.bilibili.com/video/${item.bvid}`,
      date: formatISO(new Date(item.date * 1000)),
      guid: item.bvid,
      enclosure: {
        url: item.pic,
      },
      custom_elements: [
        {
          "content:encoded": {
            _cdata: getHTMLTemplate(item),
          },
        },
      ],
    });
  });

  return new Response(rss.xml(), {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
