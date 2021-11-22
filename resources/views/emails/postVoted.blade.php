{!! $translator->trans('fof-gamification.email.body.postVoted', [
    '{recipient_display_name}' => $user->display_name,
    '{actor_display_name}' => $blueprint->vote->user->display_name,
    '{discussion_title}' => $blueprint->vote->post->discussion->title,
    '{discussion_url}' => $url->to('forum')->route('discussion', ['id' => $blueprint->vote->post->discussion->id, 'near' => $blueprint->vote->post->number]),
]) !!}
