import test from "ava";
import {AppConfig} from "../lib/loader.js";

type BasicConfig = {
	name: {
		system: string;
		product: string;
	},
	deep: {
		first: {
			second: {
				name: string;
			}
		}
	}
};

test("loads config", async (t) => {
    const deepName = "foooooo";
    process.env.deep__first__second__name = deepName;
    await AppConfig.load({
        filePath: "./test/fixtures/basic-config.json",
    });
    const config = AppConfig.get<BasicConfig>();
    t.deepEqual(config.name, {
        system: "test",
        product: "rna-app-config",
    });
    t.deepEqual(config.deep, {
        first: {
            second: {
                name: deepName
            }
        }
    });
});
