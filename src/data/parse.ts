import { writeFileSync } from "node:fs";
import LIST from "./list.json";
import DATA from "./pre_data.json";

const episodes = LIST.data.ugc_season.sections[0].episodes;

async function getList() {
  const firstAid = DATA[0].aid;
  const response = await fetch(
    `https://api.bilibili.com/x/web-interface/wbi/view?aid=${firstAid}`,
  );

  return await response.json();
}

function getVideoView(bvid: string) {
  return fetch(
    `https://api.bilibili.com/x/web-interface/wbi/view?bvid=${bvid}`,
  ).then(
    (res) =>
      res.json() as Promise<{
        data: {
          desc: string;
        };
      }>,
  );
}

async function main() {
  const list = await getList();

  writeFileSync("./list.json", JSON.stringify(list, null, 2));

  const data = await Promise.all(
    DATA.map(async (i) => {
      const aid = i.aid;
      const episode = episodes.find((e) => e.aid === aid);
      const bvid = episode?.bvid;

      if (!bvid) {
        throw new Error(`bvid not found for aid: ${aid}`);
      }

      // eslint-disable-next-line no-console
      console.log(`fetching ${bvid}`);
      const view = await getVideoView(bvid);

      return {
        ...i,
        desc: view.data.desc,
        pic: episode?.arc.pic,
        date: episode?.arc.pubdate,
        title: episode?.title,
        bvid,
      };
    }),
  );

  writeFileSync("./data.json", JSON.stringify(data, null, 2));
}

main();
