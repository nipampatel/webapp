extends Area2D

@export var speed: float = 100.0
@export var size: float = 1.0

var direction: Vector2 = Vector2.RIGHT

func _ready() -> void:
	randomize_direction()
	scale = Vector2.ONE * size

func _process(delta: float) -> void:
	position += direction * speed * delta

	var viewport_rect := get_viewport_rect()
	if position.x < -80 or position.x > viewport_rect.size.x + 80:
		direction.x *= -1
	if position.y < -80 or position.y > viewport_rect.size.y + 80:
		direction.y *= -1

func randomize_direction() -> void:
	direction = Vector2(randf_range(-1.0, 1.0), randf_range(-1.0, 1.0)).normalized()
	if direction == Vector2.ZERO:
		direction = Vector2.RIGHT

func get_size_value() -> float:
	return size

func be_eaten() -> void:
	queue_free()
