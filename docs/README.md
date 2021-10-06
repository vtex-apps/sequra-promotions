📢 Use this project, [contribute](https://github.com/{OrganizationName}/{AppName}) to it or open issues to help evolve it using [Store Discussion](https://github.com/vtex-apps/store-discussion).

# SeQura promotions

This app exports a list of SeQura's promotions selected on your SeQura Authorization app's settings.  
This is not intended to be used as a standalone app, this is dependency app for a payment connector.

<!-- DOCS-IGNORE:start -->
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)]()

<!-- ALL-CONTRIBUTORS-BADGE:END -->
<!-- DOCS-IGNORE:end -->

![Media Placeholder](https://user-images.githubusercontent.com/52087100/71204177-42ca4f80-227e-11ea-89e6-e92e65370c69.png)

## Configuration

As this exports a list, you should use it with an app that consumes this type of context. For i.e with `slider-layout`

```json
"flex-layout.col#right-col": {
    "props": {
      "preventVerticalStretch": true,
    },
    "children": [
      "flex-layout.row#product-name",
      "flex-layout.row#selling-price",
      "sku-selector",
      "flex-layout.row#buy-button",
      "list-context.promotions-list#demo"
    ]
  },
  "list-context.promotions-list#demo": {
    "children": [
      "slider-layout#demo-promotions"
    ]
  },
  "slider-layout#demo-promotions": {
    "props": {
      "itemsPerPage": {
        "desktop": 1,
        "tablet": 1,
        "phone": 1
      },
      "infinite": false
    }
  },
```

## Customization

| CSS Handles    |
| -------------- |
| `sequraWidget` |
