#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod commands;

use tauri::{CustomMenuItem, Menu, MenuItem, Submenu};

fn main() {
    tauri::Builder::default()
        .menu(Menu::with_items([Submenu::new(
            "File",
            Menu::with_items([
                CustomMenuItem::new("open-dir", "Open Folder...").into(),
                MenuItem::Quit.into(),
            ]),
        )
        .into()]))
        .on_menu_event(|ev| match ev.menu_item_id() {
            "open-dir" => {}
            id => println!("Unknown event: {}", id),
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
