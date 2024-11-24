/// <reference types="flarum/@types/translator-icu-rich" />
export default class UpvotedNotification extends Notification<import("flarum/forum/components/Notification").INotificationAttrs> {
    constructor();
    content(): import("@askvortsov/rich-icu-message-formatter").NestedStringArray;
}
import Notification from "flarum/forum/components/Notification";
