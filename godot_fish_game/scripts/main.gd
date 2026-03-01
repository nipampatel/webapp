extends Node2D

@export var fish_scene: PackedScene
@export var fish_count: int = 12

@onready var game_over_label: Label = $CanvasLayer/GameOverLabel

func _ready() -> void:
	spawn_fish()
	game_over_label.visible = false

func spawn_fish() -> void:
	var viewport_size := get_viewport_rect().size
	for i in fish_count:
		var fish := fish_scene.instantiate()
		fish.position = Vector2(
			randf_range(80.0, viewport_size.x - 80.0),
			randf_range(80.0, viewport_size.y - 80.0)
		)
		fish.size = randf_range(0.6, 2.4)
		fish.speed = randf_range(50.0, 140.0)
		add_child(fish)

func show_game_over() -> void:
	game_over_label.visible = true
	get_tree().paused = true
