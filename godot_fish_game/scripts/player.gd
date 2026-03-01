extends CharacterBody2D

@export var speed: float = 220.0
@export var growth_per_fish: float = 0.2

var size: float = 1.0
var is_game_over: bool = false

func _ready() -> void:
	$Area2D.area_entered.connect(_on_area_entered)
	_update_visual_size()

func _physics_process(_delta: float) -> void:
	if is_game_over:
		velocity = Vector2.ZERO
		return

	var input_direction := Vector2(
		Input.get_action_strength("ui_right") - Input.get_action_strength("ui_left"),
		Input.get_action_strength("ui_down") - Input.get_action_strength("ui_up")
	)

	if input_direction.length() > 1.0:
		input_direction = input_direction.normalized()

	velocity = input_direction * speed
	move_and_slide()

func _on_area_entered(area: Area2D) -> void:
	if is_game_over:
		return

	if not area.has_method("get_size_value"):
		return

	var other_size: float = area.get_size_value()

	if other_size < size:
		area.call_deferred("be_eaten")
		size += growth_per_fish
		_update_visual_size()
	else:
		trigger_game_over()

func _update_visual_size() -> void:
	scale = Vector2.ONE * size

func trigger_game_over() -> void:
	is_game_over = true
	if get_tree().current_scene.has_method("show_game_over"):
		get_tree().current_scene.show_game_over()
