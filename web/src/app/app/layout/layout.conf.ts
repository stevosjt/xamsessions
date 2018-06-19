export const layoutConf = {
  skin: 'blue',
  // isSidebarLeftCollapsed: false,
  // isSidebarLeftExpandOnOver: false,
  // isSidebarLeftMouseOver: false,
  // isSidebarLeftMini: true,
  // sidebarRightSkin: 'dark',
  // isSidebarRightCollapsed: true,
  // isSidebarRightOverContent: true,
  // layout: 'normal',
  sidebarLeftMenu: [
    {label: 'MAIN NAVIGATION', separator: true, auth: ''},
    {label: 'Dashboard', route: '', iconClasses: 'fa fa-tachometer',
      pullRights: [{text: 'New', classes: 'label pull-right bg-green'}], auth: ''},
    {label: 'Automation', iconClasses: 'fa fa-magic', children: [
      {label: 'Deployments', route: 'layout/configuration', auth: ''},
      {label: 'Bulk Deploy', route: 'layout/custom', auth: ''},
      {label: 'Bulk Deploy Logs', route: 'layout/header', auth: ''}
    ]},
    {label: 'Environments', iconClasses: 'fa fa-globe', children: [
      {label: 'Deployments', route: 'layout/configuration', auth: ''},
      {label: 'Bulk Deploy', route: 'layout/custom', auth: ''},
      {label: 'Bulk Deploy Logs', route: 'layout/header', auth: ''}
    ]},
    {label: 'Management', iconClasses: 'fa fa-users', children: [
      {label: 'Connections', route: 'layout/configuration', auth: ''},
      {label: 'Endpoints', route: 'layout/custom', auth: ''},
      {label: 'Regions', route: 'layout/header', auth: ''},
      {label: 'Roles', route: 'layout/sidebar-left', auth: ''},
      {label: 'Sections', route: 'layout/sidebar-right', auth: ''},
      {label: 'TimeZones', route: 'layout/content', auth: ''},
      {label: 'Users', route: 'layout/content', auth: ''}
    ]},
  ]
};
