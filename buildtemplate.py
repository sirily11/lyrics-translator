from staticjinja import Site


if __name__ == '__main__':
    index_context = {
        "headerid": "home"
    }

    log_context = {
        'headerid': "logs"
    }

    editing_context = {
        "useJqueryUi" : True
    }

    site = Site.make_site(contexts=[
        ("logs.html", log_context),
        ("index.html", index_context),
        ("editing-page.html",editing_context)
    ])
    site.render()
