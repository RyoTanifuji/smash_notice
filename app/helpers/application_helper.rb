module ApplicationHelper
  def default_meta_tags
    {
      site: 'SmashNotice',
      title: 'スマブラSP専用メモツール「SmashNotice」',
      reverse: true,
      separator: '|',   #Webサイト名とページタイトルを区切るために使用されるテキスト
      description: '「SmashNotice」はスマブラSPのメモを取ることに特化したメモツールです。まずは、ユーザー登録をせずにメモの作成を試せるお試しログイン機能を試してみましょう!',
      keywords: 'スマブラ,キャラ対,メモ',   #キーワードを「,」区切りで設定する
      canonical: request.original_url,   #優先するurlを指定する
      noindex: ! Rails.env.production?,
      icon: [                    #favicon、apple用アイコンを指定する
        { href: image_url('favicon.ico') },
        { href: image_url('icon.jpg'), rel: 'apple-touch-icon', sizes: '180x180', type: 'image/jpg' }
      ],
      og: {
        site_name: :site,
        title: :title,
        description: :description, 
        type: 'website',
        url: request.original_url,
        image: image_url('ogp.jpg'),
        locale: 'ja_JP'
      },
      twitter: {
        card: 'summary_large_image',
        site: '@SmashNotice',
        image: image_url('ogp.jpg')
      }
    }
  end
end
