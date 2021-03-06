jest.mock("../../revert_to_english", () => {
  return { revertToEnglish: jest.fn() };
});

import { revertToEnglishMiddleware } from "../revert_to_english_middleware";
import { revertToEnglish } from "../../revert_to_english";
import { resourceReady, newTaggedResource } from "../../sync/actions";
import { WebAppConfig } from "farmbot/dist/resources/configs/web_app";
import { arrayUnwrap } from "../../resources/util";
import { Store } from "redux";
import { Everything } from "../../interfaces";

describe("revertToEnglishMiddleware", () => {
  it("calls `revertToEnglish` when appropriate", () => {
    const dispatch = jest.fn(() => ({}));
    const data = { disable_i18n: true } as WebAppConfig;
    const tr = arrayUnwrap(newTaggedResource("WebAppConfig", data));
    const action = resourceReady("WebAppConfig", tr);
    expect(revertToEnglish).not.toHaveBeenCalled();
    revertToEnglishMiddleware.fn({} as Store<Everything>)(dispatch)(action);
    expect(revertToEnglish).toHaveBeenCalled();
    expect(revertToEnglishMiddleware.env).toBe("*");
  });
});
