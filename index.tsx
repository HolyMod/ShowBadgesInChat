import {Webpack, Injector as BaseInjector, DOM, ReactTools} from "@Holy";
import ProfileBadges from "./components/badges";
import config from "./manifest.json";
import styles from "./style.scss";

const Injector = BaseInjector.create(config.name);
const ProfileBadgesList = Webpack.findByDisplayName("UserProfileBadgeList");

export default class ShowBadgesInChat {
    onStart(): void {
        this.patchChatUsername();
        DOM.injectCSS(config.name, styles);
    }

    async patchChatUsername(): Promise<void> {
        const MessageUsername = Webpack.findModule(m => m.toString().search(/onPopoutRequestClose.*getGuildMemberAvatarURLSimple/is) > -1, {default: true});

        Injector.inject({
            module: MessageUsername,
            method: "default",
            after: (_, [{message: {author} = {} as any} = {} as any], res) => {
                const tree = ReactTools.findInReactTree(res, e => e?.["aria-describedby"] != null);

                if (!Array.isArray(tree?.children)) return;

                tree.children.splice(2, 0, (
                    <ProfileBadges user={author} />
                ));
            }
        });
    }

    onStop(): void {
        Injector.uninject();
        DOM.clearCSS(config.name);
    }
}