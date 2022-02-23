const markdownService = require('motionlink-cli/lib/services/markdown_service');
const he = require('he');
const ObjectTransformers = markdownService.ObjectTransformers;
const BlockTransformers = markdownService.BlockTransformers;

ObjectTransformers.text = (object) => {
    let out = object.text.content;

    if (object.text.link) {
        out = `[${out}](${object.text.link.url})`;
    }
    return markdownService.applyAnnotations(out, object.annotations);
}

ObjectTransformers.mention = (object) => {
    let out = '';
    if (object.mention.type === 'user') {
        const user = object.mention.user;
        if (user.type === 'person' || user.type === 'bot') {
            out = user.name;
        }
        else {
            out = object.plain_text;
        }
        if (object.href)
            out = `[${out}](${object.href})`;
    }
    else if (object.mention.type === 'date') {
        const date = object.mention.date;
        if (date.end != null)
            out = `${date.start} to ${date.end}`;
        else
            out = date.start;
        if (object.href)
            out = `[${out}](${object.href})`;
    }
    else if (object.mention.type === 'page') {
        console.log(object);
        const page = object.mention.page;
        var dateObj = new Date(page.data.properties.Date.date.start)
        out = `[${object.plain_text}](${dateObj.getFullYear()}/${dateObj.getMonth() + 1}/${dateObj.getDate()}/${page.data.properties.Slug.rich_text[0].plain_text})`;
    }
    else if (object.mention.type === 'database') {
        out = `[${object.plain_text}](${object.href})`;
    }
    return applyAnnotations(out, object.annotations);
}

BlockTransformers.image = (block, rule) => {
    if (block.type === 'image') {
        const media = markdownService.getMedia(block.image, rule);
        return `![${media.captionMarkdown}](${media.src})`;
    }
    return '';
}

/** @type {import("motionlink-cli/lib/models/config_models").TemplateRule[]} */
const rules = [
    {
        template: 'page_template.md',
        outDir: './content/posts',
        writeMediaTo: './static/',
        uses: {
            database: 'blog',
            fetchBlocks: true,
            map: (page, ctx) => {
                // Setting page._title overwrites the file name for this page, which is the page id by default.
                //
                // All Notion pages have a title. Users are, however, allowed to change the name for the title property in the
                // Notion UI. In this example, the title property is 'Name'. That is, the title column in the database is named
                // 'Name' for this example. In a database of authors, for example, you may want the title to be 'Author', in which
                // case the way to read the title text would be:
                //
                // page._title = page.data.properties.Author.title[0].plai_ntext;
                //
                // By default the title property is named 'Name'.

                var dateObj = new Date(page.data.properties.Date.date.start)
                var tags = page.data.properties.Tags.multi_select.map((tag) => {
                    return `"${tag.name}"`;
                });

                page._title = page.data.properties.Slug.rich_text[0].plain_text;

                // Use page.otherData to pass computed, or any other, data to template files.
                page.otherData.description = page.data.properties.Description.rich_text[0].plain_text;
                page.otherData.author = page.data.properties.Authors.people[0].name;
                page.otherData.date = dateObj.toISOString();
                page.otherData.dateString = page.data.properties.Date.date;
                page.otherData.tags = tags.join(', ');
                page.otherData.categories = page.otherData.tags;
                page.otherData.title = page.data.properties.Page.title[0].plain_text;
                page.otherData.titleMarkdown = '# ' + ObjectTransformers.transform_all(page.data.properties.Page.title);
                page.otherData.content = ctx.genMarkdownForBlocks(page.blocks);
                return page;
            },
            filter: {
                or: [
                    {
                        property: "Status",
                        select: {
                            equals: "Published",
                        },
                    },
                    {
                        property: "Status",
                        select: {
                            equals: "Completed",
                        },
                    },
                    {
                        property: "Status",
                        select: {
                            equals: "Public",
                        },
                    },
                ],
            }
        },
        alsoUses: [],
    },
];

module.exports = rules;