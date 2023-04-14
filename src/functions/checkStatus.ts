import * as Interfaces from "../../interfaces";
import { addresses } from "../../config";
import dns from "dns";
import ping from "pingman";

export class SiteStatusCollection implements Iterable<Interfaces.SiteStatus> {
  private sites: { [key: string]: Interfaces.SiteStatus };

  constructor(sites: { [key: string]: Interfaces.SiteStatus }) {
    this.sites = sites;
  }

  [Symbol.iterator](): Iterator<Interfaces.SiteStatus> {
    let index = 0;
    const siteKeys = Object.keys(this.sites);

    return {
      next: (): IteratorResult<Interfaces.SiteStatus> => {
        if (index < siteKeys.length) {
          const siteStatus = this.sites[siteKeys[index]];
          index++;
          return { value: siteStatus, done: false };
        } else {
          return { value: null as any, done: true };
        }
      },
    };
  }
}

export default async function checkStatus() {
  let sites: { [key: string]: Interfaces.SiteStatus } = {};

  for (let i of addresses) {
    try {
      await dns.promises.lookup(i);

      const result = await ping(i, {
        timeout: 5, // seconds
      });

      if (result.alive) {
        sites[i] = {
          time: new Date(),
          name: i,
          status: "ONLINE",
          ping: result.time,
        } as Interfaces.SiteStatus;
      } else {
        sites[i] = {
          time: new Date(),
          name: i,
          status: "OFFLINE",
        } as Interfaces.SiteStatus;
      }
    } catch (error) {
      sites[i] = {
        time: new Date(),
        name: i,
        status: "OFFLINE",
      } as Interfaces.SiteStatus;
    }
  }

  return new SiteStatusCollection(sites);
}
