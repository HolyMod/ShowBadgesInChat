import {Webpack, LoggerModule, DiscordModules} from "@Holy";
import config from "../manifest.json";

const Logger = new LoggerModule(config.name);

const ProfileBadgesList = Webpack.findByDisplayName("UserProfileBadgeList");

export default function ProfileBadges(props: any) {
    const userProfile = DiscordModules.Flux.useStateFromStores([DiscordModules.UserProfileStore], () => {
        return DiscordModules.UserProfileStore.getUserProfile(props.user.id);
    });
    const ret = ProfileBadgesList(Object.assign({}, props, {
        premiumSince: userProfile?.premiumSince,
        premiumGuildSince: userProfile?.premiumGuildSince
    }));

    try {
        for (let i = 0; i < ret.props.children.length; i++) {
            ret.props.children[i].props.spacing = 8;
        }
    } catch (error) {
        Logger.error("Something went wrong while patching tooltip spacing:", error);
    }

    return (
        <div className="be-container">
            {ret}
        </div>
    );
}