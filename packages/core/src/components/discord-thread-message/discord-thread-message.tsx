import { Component, ComponentInterface, Element, h, Host, Prop } from '@stencil/core';
import Fragment from '../../Fragment';
import { avatars, Profile, profiles } from '../../options';
import VerifiedTick from '../svgs/verified-tick';
import Image from 'next/image';

@Component({
	tag: 'discord-thread-message',
	styleUrl: 'discord-thread-message.css'
})
export class DiscordThreadMessage implements ComponentInterface {
	/**
	 * The DiscordThreadMessage element.
	 */
	@Element()
	public el: HTMLElement;

	/**
	 * The id of the profile data to use.
	 */
	@Prop()
	public profile: string;

	/**
	 * The message author's username.
	 * @default 'User'
	 */
	@Prop()
	public author = 'User';

	/**
	 * The message author's avatar. Can be an avatar shortcut, relative path, or external link.
	 */
	@Prop()
	public avatar: string;

	/**
	 * Whether the message author is a bot or not.
	 * Only works if `server` is `false` or `undefined`.
	 */
	@Prop()
	public bot = false;

	/**
	 * Whether the message author is a server crosspost webhook or not.
	 * Only works if `bot` is `false` or `undefined`.
	 */
	@Prop()
	public server = false;

	/**
	 * Whether the bot is verified or not.
	 * Only works if `bot` is `true`
	 */
	@Prop()
	public verified = false;

	/**
	 * Whether the message has been edited or not.
	 */
	@Prop()
	public edited = false;

	/**
	 * The message author's primary role color. Can be any [CSS color value](https://www.w3schools.com/cssref/css_colors_legal.asp).
	 */
	@Prop()
	public roleColor: string;

	/**
	 * The relative timestamp of the message.
	 */
	@Prop()
	public relativeTimestamp = '1m ago';

	public render() {
		const resolveAvatar = (avatar: string): string => avatars[avatar] ?? avatar ?? avatars.default;

		const defaultData: Profile = { author: this.author, bot: this.bot, verified: this.verified, server: this.server, roleColor: this.roleColor };
		const profileData: Profile = Reflect.get(profiles, this.profile) ?? {};
		const profile: Profile = { ...defaultData, ...profileData, ...{ avatar: resolveAvatar(profileData.avatar ?? this.avatar) } };

		return (
			<Host class="discord-thread-message">
				<Image src={profile.avatar!} className="discord-thread-message-avatar" alt={profile.author} />
				<Fragment>
					{profile.bot && !profile.server && (
						<span class="discord-application-tag">
							{profile.verified && <VerifiedTick />}
							Bot
						</span>
					)}
					{profile.server && !profile.bot && <span class="discord-application-tag">Server</span>}
				</Fragment>
				<span class="discord-thread-message-username" style={{ color: profile.roleColor }}>
					{profile.author}
				</span>
				<div class="discord-thread-message-content">
					<slot />
					{this.edited ? <span class="discord-message-edited">(edited)</span> : ''}
				</div>
				<span class="discord-thread-message-timestamp">{this.relativeTimestamp}</span>
			</Host>
		);
	}
}
